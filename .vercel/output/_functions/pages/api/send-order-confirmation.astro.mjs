import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

const resend = new Resend(undefined                              );
const POST = async ({ request }) => {
  try {
    const order = await request.json();
    if (!order.customer?.email || !order.id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailHtml = generateEmailHtml(order);
    const testEmail = "dgaric1@gmail.com";
    const { data, error } = await resend.emails.send({
      from: "Eko Leventić <noreply@eko-leventic.hr>",
      // TODO: Ažurirati s verified domain
      to: [order.customer.email, testEmail],
      // Pošalji i kupcu i na test email
      subject: `Potvrda narudžbe ${order.id} - Eko Leventić`,
      html: emailHtml
    });
    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
function generateEmailHtml(order) {
  const bankDetails = {
    iban: "HR6225000093120447816",
    recipient: "OPG Mario Leventić",
    model: "HR00",
    paymentDeadline: 7,
    // dani
    contactEmail: "info@eko-leventic.hr",
    contactPhone: "+385 91 736 9919"
  };
  const orderDate = new Date(order.createdAt).toLocaleDateString("hr-HR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrda narudžbe ${order.id}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f0f9f4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
    <h1 style="color: #15803d; margin: 0;">Narudžba je uspješno kreirana!</h1>
    <p style="margin: 10px 0 0 0; color: #166534;">Broj narudžbe: <strong>${order.id}</strong></p>
  </div>

  <p>Poštovani/a ${order.customer.firstName} ${order.customer.lastName},</p>
  
  <p>Hvala vam na narudžbi! Vaša narudžba je primljena i čeka uplatu.</p>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">DETALJI NARUDŽBE</h2>
  <p><strong>Broj narudžbe:</strong> ${order.id}</p>
  <p><strong>Datum:</strong> ${orderDate}</p>
  <p><strong>Status:</strong> <span style="color: #ea580c;">Na čekanju uplate / Pending payment</span></p>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">PROIZVODI</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    ${order.items.map(
    (item) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px 0;">${item.product.name}</td>
      <td style="text-align: right; padding: 10px 0;">${item.quantity} × ${item.product.price.toFixed(2)} €</td>
      <td style="text-align: right; padding: 10px 0; font-weight: bold;">${(item.product.price * item.quantity).toFixed(2)} €</td>
    </tr>
    `
  ).join("")}
  </table>

  <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 5px 0;"><strong>Međuzbir:</strong> <span style="float: right;">${order.subtotal.toFixed(2)} €</span></p>
    <p style="margin: 5px 0;"><strong>Dostava:</strong> <span style="float: right;">${order.shipping.toFixed(2)} €</span></p>
    <p style="margin: 10px 0; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 18px;"><strong>UKUPNO:</strong> <span style="float: right; color: #2563eb; font-size: 20px;">${order.total.toFixed(2)} €</span></p>
  </div>

  <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">PODACI ZA UPLATU</h2>
  
  <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <div style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">IBAN</p>
      <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #1e40af;">${bankDetails.iban}</p>
    </div>

    <p style="margin: 10px 0;"><strong>Primatelj:</strong> ${bankDetails.recipient}</p>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">Iznos</p>
      <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1e40af;">${order.total.toFixed(2)} EUR</p>
    </div>

    <p style="margin: 10px 0;"><strong>Model:</strong> ${bankDetails.model}</p>
    <p style="margin: 10px 0;"><strong>Poziv na broj:</strong> ${order.paymentReference}</p>
  </div>

  <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;">⚠️ VAŽNO - Payment Reference:</p>
    <p style="margin: 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #92400e;">${order.paymentReference}</p>
    <p style="margin: 10px 0 0 0; font-size: 14px; color: #78350f;">U polje opis/reference uplate napišite broj narudžbe: <strong>${order.paymentReference}</strong></p>
  </div>

  <div style="background-color: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 5px 0; font-weight: bold; color: #991b1b;">⏰ Rok za uplatu</p>
    <p style="margin: 0; font-size: 14px; color: #7f1d1d;">Molimo izvršite uplatu u roku <strong>${bankDetails.paymentDeadline} dana</strong>, inače narudžba će biti automatski otkazana.</p>
  </div>

  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold;">Kontakt za probleme s uplatom:</p>
    <p style="margin: 5px 0;">Email: <a href="mailto:${bankDetails.contactEmail}" style="color: #2563eb;">${bankDetails.contactEmail}</a></p>
    <p style="margin: 5px 0;">Telefon: <a href="tel:${bankDetails.contactPhone}" style="color: #2563eb;">${bankDetails.contactPhone}</a></p>
  </div>

  <p style="margin-top: 30px;">Hvala vam!</p>
  <p><strong>Eko Leventić</strong></p>
</body>
</html>
  `.trim();
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
