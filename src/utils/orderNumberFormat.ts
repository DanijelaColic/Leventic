/** Normalizira ORD- prefiks — vraća samo kratki broj narudžbe */
export function stripOrderPrefix(orderNumber: string): string {
  return orderNumber.replace(/^ORD-/, '')
}

/** Format za Supabase order_number stupac */
export function toDbOrderNumber(shortNumber: string): string {
  return `ORD-${stripOrderPrefix(shortNumber)}`
}

/** YYMMDD u Europe/Zagreb vremenskoj zoni */
export function formatOrderDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Zagreb',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const y = parts.find((p) => p.type === 'year')?.value ?? '00'
  const m = parts.find((p) => p.type === 'month')?.value ?? '01'
  const d = parts.find((p) => p.type === 'day')?.value ?? '01'
  return `${y}${m}${d}`
}
