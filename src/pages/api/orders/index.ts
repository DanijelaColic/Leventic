import type { APIRoute } from 'astro'
import {
  validateCheckoutPayload,
  createOrderInDatabase,
  logCheckoutFailure,
} from '../../../lib/checkoutOrder'

/**
 * Javni endpoint za kreiranje narudžbe iz checkouta.
 * Nije pod /api/admin/ — ad blockeri ne blokiraju ovaj put.
 */
export const POST: APIRoute = async ({ request }) => {
  const userAgent = request.headers.get('user-agent') || undefined

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    await logCheckoutFailure({
      error_code: 'INVALID_JSON',
      error_message: 'Request body nije valjani JSON',
      user_agent: userAgent,
    })
    return new Response(
      JSON.stringify({ error: 'Neispravan format zahtjeva' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const validation = validateCheckoutPayload(rawBody)

  if (!validation.ok) {
    const body = rawBody as Record<string, unknown>
    await logCheckoutFailure({
      order_number: String(body.order_number || ''),
      customer_email: String(body.customer_email || ''),
      customer_name: String(body.customer_name || ''),
      customer_phone: String(body.customer_phone || ''),
      error_code: 'VALIDATION_FAILED',
      error_message: validation.errors.join('; '),
      error_details: { errors: validation.errors },
      request_payload: body as Record<string, unknown>,
      user_agent: userAgent,
    })
    return new Response(
      JSON.stringify({ error: 'Validacija nije prošla', details: validation.errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const order = validation.data
  const result = await createOrderInDatabase(order)

  if (result.error) {
    const isDuplicate =
      result.error.includes('duplicate') ||
      result.error.includes('unique')

    await logCheckoutFailure({
      order_number: order.order_number,
      customer_email: order.customer_email,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      error_code: isDuplicate ? 'DUPLICATE_ORDER' : 'DATABASE_ERROR',
      error_message: result.error,
      request_payload: order as unknown as Record<string, unknown>,
      user_agent: userAgent,
    })

    return new Response(
      JSON.stringify({
        error: 'Narudžba nije spremljena',
        details: result.error,
        code: isDuplicate ? 'DUPLICATE_ORDER' : 'DATABASE_ERROR',
      }),
      { status: isDuplicate ? 409 : 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(JSON.stringify(result.data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
