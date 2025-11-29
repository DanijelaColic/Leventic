import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

const resend = new Resend(undefined                              );
const POST = async ({ request }) => {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailSubject = subject || "Kontakt sa web stranice - Eko Leventić";
    const emailHtml = generateContactEmailHtml(name, email, subject, message);
    const testEmail = "dgaric1@gmail.com";
    const { data, error } = await resend.emails.send({
      from: "Eko Leventić Web <noreply@eko-leventic.hr>",
      // TODO: Ažurirati s verified domain
      to: testEmail,
      // Privremeno samo na test email
      replyTo: email,
      // Odgovor ide na email korisnika koji je poslao poruku
      subject: emailSubject,
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
function generateContactEmailHtml(name, email, subject, message) {
  const emailSubject = subject || "Kontakt sa web stranice";
  return `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
    <h1 style="color: #1e40af; margin: 0;">Nova poruka s web stranice</h1>
    <p style="margin: 10px 0 0 0; color: #1e3a8a;">Eko Leventić - Kontakt obrazac</p>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Podaci pošiljatelja</h2>
    <p style="margin: 10px 0;"><strong>Ime i prezime:</strong> ${name}</p>
    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
    ${subject ? `<p style="margin: 10px 0;"><strong>Predmet:</strong> ${subject}</p>` : ""}
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
    <h2 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Poruka</h2>
    <p style="white-space: pre-wrap; margin: 0;">${message}</p>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p style="margin: 0;">Ova poruka je poslana s kontakt obrasca na web stranici Eko Leventić.</p>
    <p style="margin: 5px 0 0 0;">Za odgovor, kliknite na email adresu pošiljatelja iznad.</p>
  </div>
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
