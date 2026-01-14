import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import type { DbOrder } from '../../../lib/supabase';
import type { Order } from '../../../utils/orders';

// Helper function to convert DbOrder to Order format
function convertDbOrderToOrder(dbOrder: DbOrder): Order {
  // Extract order number without ORD- prefix
  const orderNumber = dbOrder.order_number.replace(/^ORD-/, '');

  // Parse customer name into first and last name
  // Handle cases where name might be empty or have multiple spaces
  const nameParts = dbOrder.customer_name?.trim().split(/\s+/) || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Log for debugging
  console.log(`[API] Parsing customer name: "${dbOrder.customer_name}" -> firstName: "${firstName}", lastName: "${lastName}"`);

  // Convert items from DbOrder format to Order format
  const items = dbOrder.items.map((item) => ({
    product: {
      id: item.productId,
      name: item.productName,
      price: item.price,
      image: '', // We don't have image in DbOrder, will need to fetch or use placeholder
      unit: 'kom',
      emoji: '📦',
    },
    quantity: item.quantity,
    selectedWeight: item.variant,
  }));

  // Map status from DbOrder to Order format
  const statusMap: Record<string, Order['status']> = {
    pending: 'pending_payment',
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'completed',
    cancelled: 'cancelled',
  };

  console.log(`[API] Converting DbOrder to Order format. order_number: ${dbOrder.order_number}, extracted orderNumber: ${orderNumber}`);

  return {
    id: orderNumber,
    orderNumber: orderNumber,
    customer: {
      firstName,
      lastName,
      email: dbOrder.customer_email,
      phone: dbOrder.customer_phone,
      address: dbOrder.customer_address,
      city: dbOrder.customer_city,
      postalCode: dbOrder.customer_postal_code,
      country: 'Hrvatska', // Default, could be stored in DB
    },
    items,
    subtotal: dbOrder.subtotal,
    shipping: dbOrder.shipping_cost,
    total: dbOrder.total,
    status: statusMap[dbOrder.status] || 'pending_payment',
    createdAt: dbOrder.created_at,
    paymentReference: orderNumber,
    deliveryMethod: dbOrder.notes?.includes('OSOBNO PREUZIMANJE') ? 'pickup' : 'delivery',
  };
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const orderId = params.orderId;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Try to find order by order_number (format: ORD-{orderNumber})
    let dbOrder: DbOrder | null = null;

    console.log(`[API] Fetching order with orderId: ${orderId}`);

    // First try with ORD- prefix
    const { data: orderData1, error: error1 } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', `ORD-${orderId}`)
      .single();

    console.log(`[API] Try 1 - ORD-${orderId}:`, { found: !!orderData1, error: error1?.message });

    if (!error1 && orderData1) {
      dbOrder = orderData1;
    } else {
      // Try without ORD- prefix
      const { data: orderData2, error: error2 } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_number', orderId)
        .single();

      console.log(`[API] Try 2 - ${orderId}:`, { found: !!orderData2, error: error2?.message });

      if (!error2 && orderData2) {
        dbOrder = orderData2;
      } else {
        // Try by UUID id
        const { data: orderData3, error: error3 } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        console.log(`[API] Try 3 - UUID ${orderId}:`, { found: !!orderData3, error: error3?.message });

        if (!error3 && orderData3) {
          dbOrder = orderData3;
        }
      }
    }

    if (!dbOrder) {
      console.log(`[API] Order not found after all attempts. orderId: ${orderId}`);
      return new Response(
        JSON.stringify({ 
          error: 'Order not found',
          searchedFor: {
            withPrefix: `ORD-${orderId}`,
            withoutPrefix: orderId,
            asUUID: orderId,
          },
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    console.log(`[API] Order found! order_number: ${dbOrder.order_number}, id: ${dbOrder.id}`);

    // Convert DbOrder to Order format
    const order = convertDbOrderToOrder(dbOrder);

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch order',
        details: error?.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
