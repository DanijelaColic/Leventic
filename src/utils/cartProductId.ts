/** Parsira product.id — varijanta samo ako završava s kg/g/gr/kom (npr. "1-5kg", ne "1773060506258") */
export function parseCartProductId(productId: string): {
  productId: string
  variant?: string
} {
  const variantMatch = productId.match(
    /^(.+)-(\d+(?:\.\d+)?(?:kg|g|gr|kom))$/i,
  )
  if (variantMatch) {
    return { productId: variantMatch[1], variant: variantMatch[2] }
  }
  return { productId }
}
