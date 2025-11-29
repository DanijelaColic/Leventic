import { Resend } from 'resend'
import type { APIRoute } from 'astro'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('=== Contact Form API Called ===')
    console.log('Request method:', request.method)
    console.log('Request URL:', request.url)
    console.log('Content-Type:', request.headers.get('content-type'))
    console.log('Content-Length:', request.headers.get('content-length'))
    
    // Parsiranje request body-ja - jednostavno kao u send-order-confirmation.ts
    let body
    try {
      body = await request.json()
      console.log('Successfully parsed request body:', body)
    } catch (jsonError) {
      console.error('Failed to parse JSON:', jsonError)
      // Probaj čitati kao text za debugging
      try {
        const clonedRequest = request.clone()
        const textBody = await clonedRequest.text()
        console.log('Raw request body (as text):', textBody)
        console.log('Text body length:', textBody.length)
      } catch (textError) {
        console.error('Failed to read as text:', textError)
      }
      throw jsonError
    }

    // Validacija podataka
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields', details: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { name, email, subject, message } = body

    const emailSubject = subject || 'Kontakt sa web stranice - Eko Leventić'
    const emailHtml = generateContactEmailHtml(name, email, subject, message)

    // PRIVREMENO: Šalje se na test email za testiranje
    const testEmail = 'dgaric1@gmail.com'
    
    console.log('Attempting to send email to:', testEmail)
    console.log('Email subject:', emailSubject)
    
    // Pošalji email kroz Resend
    console.log('Calling Resend API...')
    let resendResponse
    try {
      resendResponse = await resend.emails.send({
        from: 'Eko Leventić Web <onboarding@resend.dev>', // Koristi Resend test domain za sada
        to: testEmail, // Privremeno samo na test email
        replyTo: email, // Odgovor ide na email korisnika koji je poslao poruku
        subject: emailSubject,
        html: emailHtml,
      })
      console.log('Resend response received:', JSON.stringify(resendResponse, null, 2))
    } catch (resendError) {
      console.error('Resend API call failed:', resendError)
      const errorMsg = resendError instanceof Error ? resendError.message : String(resendError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: errorMsg 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = resendResponse || {}

    if (error) {
      console.error('Resend error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: error.message || JSON.stringify(error) 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Email sent successfully!')
    console.log('Message ID:', data?.id)

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: errorMessage 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function generateContactEmailHtml(
  name: string,
  email: string,
  subject: string | null,
  message: string
): string {
  const emailSubject = subject || 'Kontakt sa web stranice'

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
    ${subject ? `<p style="margin: 10px 0;"><strong>Predmet:</strong> ${subject}</p>` : ''}
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
  `.trim()
}

