import { Resend } from 'resend'
import type { APIRoute } from 'astro'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  try {
    const order = await request.json()

    // Validacija podataka
    if (!order.customer?.email || !order.id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generiraj HTML email body za kupca
    const customerEmailHtml = generateEmailHtml(order)
    
    // Generiraj HTML email body za admina
    const adminEmailHtml = generateAdminNotificationHtml(order)

    // Provjeri da li postoji RESEND_API_KEY
    if (!import.meta.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      // Ne vraćaj grešku korisniku, samo logiraj
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Pošalji potvrdu narudžbe kupcu
    const customerEmailResult = await resend.emails.send({
      from: 'Eko Leventić <info@eko-leventic.hr>', // Verificirana domena
      to: order.customer.email, // Samo kupac prima potvrdu narudžbe
      subject: `Potvrda narudžbe #${order.id} - Eko Leventić`,
      html: customerEmailHtml,
    })

    if (customerEmailResult.error) {
      console.error('Resend error (customer email):', customerEmailResult.error)
      // Ne zaustavljaj proces ako customer email ne uspije, ali logiraj
    }

    // Pošalji obavijest o novoj narudžbi adminu
    const adminEmail = 'info@eko-leventic.hr'
    const adminEmailResult = await resend.emails.send({
      from: 'Eko Leventić <info@eko-leventic.hr>', // Verificirana domena
      to: adminEmail, // Admin prima obavijest o novoj narudžbi
      subject: `Nova narudžba #${order.id} - Eko Leventić`,
      html: adminEmailHtml,
    })

    if (adminEmailResult.error) {
      console.error('Resend error (admin email):', adminEmailResult.error)
      // Ne zaustavljaj proces ako admin email ne uspije, ali logiraj
    }

    // Vrati uspjeh ako je barem jedan email poslan
    const success = !customerEmailResult.error || !adminEmailResult.error

    return new Response(
      JSON.stringify({ 
        success, 
        customerMessageId: customerEmailResult.data?.id,
        adminMessageId: adminEmailResult.data?.id 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function generateEmailHtml(order: any): string {
  // Bankovni podaci - ažurirani s pravim podacima
  const bankDetails = {
    iban: 'HR6225000093120447816',
    recipient: 'Mario Leventić',
    address: 'Osječka 120, 31431 Čepin',
    model: 'HR00',
    paymentDeadline: 7, // dani
    contactEmail: 'info@eko-leventic.hr',
    contactPhone: '+385 91 736 9919',
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('hr-HR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Izračunaj rok za uplatu
  const paymentDeadlineDate = new Date(order.createdAt)
  paymentDeadlineDate.setDate(paymentDeadlineDate.getDate() + bankDetails.paymentDeadline)
  const formattedDeadline = paymentDeadlineDate.toLocaleDateString('hr-HR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrda narudžbe #${order.id}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f0f9f4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
    <h1 style="color: #15803d; margin: 0;">Narudžba je uspješno kreirana!</h1>
    <p style="margin: 10px 0 0 0; color: #166534;">Broj narudžbe: <strong>#${order.id}</strong></p>
  </div>

  <p>Poštovani/a ${order.customer.firstName} ${order.customer.lastName},</p>
  
  <p>Hvala vam na narudžbi! Vaša narudžba je primljena i čeka uplatu.</p>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">DETALJI NARUDŽBE</h2>
  <p><strong>Broj narudžbe:</strong> #${order.id}</p>
  <p><strong>Datum:</strong> ${orderDate}</p>
  <p><strong>Status:</strong> <span style="color: #ea580c;">Na čekanju uplate / Pending payment</span></p>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">PROIZVODI</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    ${order.items
      .map(
        (item: any) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px 0;">${item.product.name}</td>
      <td style="text-align: right; padding: 10px 0;">${item.quantity} × ${item.product.price.toFixed(2)} €</td>
      <td style="text-align: right; padding: 10px 0; font-weight: bold;">${(item.product.price * item.quantity).toFixed(2)} €</td>
    </tr>
    `
      )
      .join('')}
  </table>

  <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 5px 0;"><strong>Međuzbir:</strong> <span style="float: right;">${order.subtotal.toFixed(2)} €</span></p>
    <p style="margin: 5px 0;"><strong>${order.deliveryMethod === 'pickup' ? 'Osobno preuzimanje:' : 'Dostava:'}</strong> <span style="float: right;${order.deliveryMethod === 'pickup' ? ' color: #059669; font-weight: bold;' : ''}">${order.deliveryMethod === 'pickup' ? 'Besplatno' : order.shipping.toFixed(2) + ' €'}</span></p>
    <p style="margin: 10px 0; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 18px;"><strong>UKUPNO:</strong> <span style="float: right; color: #2563eb; font-size: 20px;">${order.total.toFixed(2)} €</span></p>
  </div>

  ${order.deliveryMethod === 'pickup' ? `
  <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #166534; font-size: 16px;">🏠 OSOBNO PREUZIMANJE</p>
    <p style="margin: 0; color: #15803d;">
      ${order.customer.address}<br>
      ${order.customer.postalCode} ${order.customer.city}
    </p>
    <p style="margin: 10px 0 0 0; font-size: 14px; color: #166534;">Kontaktirat ćemo vas nakon uplate radi dogovora termina preuzimanja.</p>
  </div>
  ` : ''}

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">📝 PODACI ZA UPLATU</h2>
  
  <p style="font-size: 16px; margin: 15px 0;">Molimo izvršite uplatu na sljedeći račun:</p>

  <div style="background-color: #eff6ff; border: 3px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
      <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: bold;">IBAN primatelja</p>
      <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 20px; font-weight: bold; color: #1e40af; letter-spacing: 1px;">${bankDetails.iban}</p>
    </div>

    <div style="margin: 15px 0; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
      <p style="margin: 0;"><strong>Primatelj:</strong> ${bankDetails.recipient}</p>
      <p style="margin: 5px 0 0 0; color: #4b5563;">${bankDetails.address}</p>
    </div>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; border: 2px solid #10b981;">
      <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: bold;">Iznos za uplatu</p>
      <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #059669;">${order.total.toFixed(2)} €</p>
    </div>

    <div style="margin: 15px 0; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
      <p style="margin: 5px 0;"><strong>Model:</strong> ${bankDetails.model}</p>
      <p style="margin: 5px 0;"><strong>Poziv na broj:</strong> ${order.paymentReference}</p>
    </div>
  </div>

  <div style="background-color: #fef3c7; border: 3px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e; font-size: 16px;">⚠️ VAŽNO - Reference/Opis uplate:</p>
    <p style="margin: 5px 0; font-family: monospace; font-size: 22px; font-weight: bold; color: #92400e; background-color: white; padding: 12px; border-radius: 6px; text-align: center; letter-spacing: 2px;">REF${order.paymentReference}</p>
    <p style="margin: 15px 0 0 0; font-size: 15px; color: #78350f;">U polje <strong>opis/reference uplate</strong> obavezno napišite: <strong style="font-family: monospace;">REF${order.paymentReference}</strong></p>
    <p style="margin: 10px 0 0 0; font-size: 14px; color: #78350f;">Ovo je broj vaše narudžbe i omogućit će nam da brzo identificiramo vašu uplatu.</p>
  </div>

  <div style="background-color: #fee2e2; border: 3px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #991b1b; font-size: 16px;">⏰ Rok za uplatu</p>
    <p style="margin: 0 0 10px 0; font-size: 18px; color: #7f1d1d; font-weight: bold;">Do ${formattedDeadline}</p>
    <p style="margin: 0; font-size: 14px; color: #7f1d1d;">Molimo izvršite uplatu u roku <strong>${bankDetails.paymentDeadline} dana</strong> (do datuma navedenog gore), inače narudžba će biti automatski otkazana.</p>
  </div>

  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold;">Kontakt za probleme s uplatom:</p>
    <p style="margin: 5px 0;">Email: <a href="mailto:${bankDetails.contactEmail}" style="color: #2563eb;">${bankDetails.contactEmail}</a></p>
    <p style="margin: 5px 0;">Telefon: <a href="tel:${bankDetails.contactPhone}" style="color: #2563eb;">${bankDetails.contactPhone}</a></p>
  </div>

  <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 30px 0;">
    <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">${order.deliveryMethod === 'pickup' ? '🏠' : '📦'} Što se događa dalje?</h3>
    ${order.deliveryMethod === 'pickup' ? `
    <ol style="margin: 0; padding-left: 20px; color: #1e3a8a;">
      <li style="margin: 8px 0;">Izvršite uplatu koristeći podatke navedene gore</li>
      <li style="margin: 8px 0;">Provjerit ćemo vašu uplatu prema bankovnom izvodu (može potrajati 1-2 radna dana)</li>
      <li style="margin: 8px 0;">Nakon potvrde uplate, kontaktirat ćemo vas radi dogovora termina preuzimanja</li>
      <li style="margin: 8px 0;">Pripremit ćemo vaše proizvode za preuzimanje</li>
      <li style="margin: 8px 0;">Preuzmite narudžbu na dogovorenoj lokaciji</li>
    </ol>
    ` : `
    <ol style="margin: 0; padding-left: 20px; color: #1e3a8a;">
      <li style="margin: 8px 0;">Izvršite uplatu koristeći podatke navedene gore</li>
      <li style="margin: 8px 0;">Provjerit ćemo vašu uplatu prema bankovnom izvodu (može potrajati 1-2 radna dana)</li>
      <li style="margin: 8px 0;">Nakon potvrde uplate, promijeniti ćemo status narudžbe na "Uplaćeno / Processing"</li>
      <li style="margin: 8px 0;">Pripremit ćemo i poslati vaše proizvode</li>
      <li style="margin: 8px 0;">Obavijestit ćemo vas kada narudžba bude poslana</li>
    </ol>
    `}
  </div>

  <p style="margin-top: 30px; font-size: 16px;">Hvala vam na povjerenju!</p>
  <p style="margin: 5px 0;"><strong style="font-size: 18px;">OPG Mario Leventić</strong></p>
  <p style="margin: 5px 0; color: #6b7280;">Ekološka proizvodnja pira i pirovog brašna</p>
</body>
</html>
  `.trim()
}

function generateAdminNotificationHtml(order: any): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('hr-HR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova narudžba #${order.id}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
    <h1 style="color: #1e40af; margin: 0;">🆕 Nova narudžba primljena!</h1>
    <p style="margin: 10px 0 0 0; color: #1e3a8a;">Broj narudžbe: <strong>#${order.id}</strong></p>
  </div>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">DETALJI NARUDŽBE</h2>
  <p><strong>Broj narudžbe:</strong> #${order.id}</p>
  <p><strong>Datum i vrijeme:</strong> ${orderDate}</p>
  <p><strong>Status:</strong> <span style="color: #ea580c;">Na čekanju uplate / Pending payment</span></p>
  <p><strong>Poziv na broj:</strong> ${order.paymentReference}</p>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">PODACI O KUPCU</h2>
  <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 5px 0;"><strong>Ime i prezime:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${order.customer.email}" style="color: #2563eb;">${order.customer.email}</a></p>
    <p style="margin: 5px 0;"><strong>Telefon:</strong> <a href="tel:${order.customer.phone}" style="color: #2563eb;">${order.customer.phone}</a></p>
    <p style="margin: 5px 0;"><strong>Adresa:</strong> ${order.customer.address}</p>
    <p style="margin: 5px 0;"><strong>Grad:</strong> ${order.customer.city}</p>
    <p style="margin: 5px 0;"><strong>Poštanski broj:</strong> ${order.customer.postalCode}</p>
    ${order.customer.country ? `<p style="margin: 5px 0;"><strong>Država:</strong> ${order.customer.country}</p>` : ''}
  </div>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">PROIZVODI</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    ${order.items
      .map(
        (item: any) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px 0;">${item.product.name}${item.selectedWeight ? ` (${item.selectedWeight})` : ''}</td>
      <td style="text-align: right; padding: 10px 0;">${item.quantity} × ${item.product.price.toFixed(2)} €</td>
      <td style="text-align: right; padding: 10px 0; font-weight: bold;">${(item.product.price * item.quantity).toFixed(2)} €</td>
    </tr>
    `
      )
      .join('')}
  </table>

  <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 5px 0;"><strong>Međuzbir:</strong> <span style="float: right;">${order.subtotal.toFixed(2)} €</span></p>
    <p style="margin: 5px 0;"><strong>${order.deliveryMethod === 'pickup' ? 'Osobno preuzimanje:' : 'Dostava:'}</strong> <span style="float: right;${order.deliveryMethod === 'pickup' ? ' color: #059669; font-weight: bold;' : ''}">${order.deliveryMethod === 'pickup' ? 'Besplatno' : order.shipping.toFixed(2) + ' €'}</span></p>
    <p style="margin: 10px 0; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 18px;"><strong>UKUPNO:</strong> <span style="float: right; color: #2563eb; font-size: 20px;">${order.total.toFixed(2)} €</span></p>
  </div>

  ${order.deliveryMethod === 'pickup' ? `
  <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #166534; font-size: 16px;">🏠 OSOBNO PREUZIMANJE</p>
    <p style="margin: 0; color: #15803d;">
      ${order.customer.address}<br>
      ${order.customer.postalCode} ${order.customer.city}
    </p>
  </div>
  ` : `
  <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af; font-size: 16px;">📦 DOSTAVA</p>
    <p style="margin: 0; color: #1e3a8a;">
      ${order.customer.address}<br>
      ${order.customer.postalCode} ${order.customer.city}${order.customer.country ? `<br>${order.customer.country}` : ''}
    </p>
  </div>
  `}

  <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #78350f;">
      <strong>Napomena:</strong> Provjerite uplatu koristeći poziv na broj: <strong style="font-family: monospace;">REF${order.paymentReference}</strong>
    </p>
  </div>

  <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
    Ova obavijest je automatski generirana kada je nova narudžba kreirana.
  </p>
</body>
</html>
  `.trim()
}

