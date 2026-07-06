import type { APIRoute } from 'astro'
import { logCheckoutFailure } from '../../../lib/checkoutOrder'

/**
 * Klijent poziva kad checkout potpuno ne uspije (npr. mreža + localStorage).
 * Omogućuje adminu uvid u neuspjele pokušaje.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const userAgent = request.headers.get('user-agent') || undefined

    await logCheckoutFailure({
      order_number: body.order_number,
      customer_email: body.customer_email,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      error_code: body.error_code || 'CLIENT_CHECKOUT_FAILED',
      error_message: body.error_message || 'Nepoznata greška na klijentu',
      error_details: body.error_details,
      request_payload: body.request_payload,
      user_agent: userAgent,
    })

    return new Response(JSON.stringify({ logged: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('[log-checkout-failure] Error:', error)
    return new Response(JSON.stringify({ logged: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
