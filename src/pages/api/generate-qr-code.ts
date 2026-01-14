import type { APIRoute } from 'astro';
import { generatePDF417 } from '../../lib/barcodeUtils';

// Bank account details
const bankDetails = {
  recipientName: 'Mario Leventić',
  recipientAddress1: 'Osječka 120',
  recipientAddress2: '31431 Čepin',
  iban: 'HR6225000093120447816',
  currency: 'EUR',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { amount, orderId, firstName, lastName } = body;

    // Validate required fields
    if (!amount || !orderId || !firstName || !lastName) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: amount, orderId, firstName, lastName',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Debug: log input data
    console.log('QR Code Generation Input:', {
      amount: parseFloat(amount),
      orderId: String(orderId),
      firstName,
      lastName,
    });

    // Generate QR code
    const qrCodeDataUrl = await generatePDF417(
      {
        amount: parseFloat(amount),
        orderId: String(orderId),
        userMeta: {
          ime: firstName,
          prezime: lastName,
        },
      },
      bankDetails,
    );

    return new Response(
      JSON.stringify({
        qrCode: qrCodeDataUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate QR code',
        details: error?.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
