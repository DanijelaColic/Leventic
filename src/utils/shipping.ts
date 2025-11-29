/**
 * Izračunava cijenu dostave na temelju ukupne težine proizvoda
 * @param totalWeightKg - Ukupna težina u kilogramima
 * @returns Cijena dostave u eurima
 */
export function calculateShipping(totalWeightKg: number): number {
  if (totalWeightKg <= 0) return 0
  if (totalWeightKg <= 20) return 6.0
  if (totalWeightKg <= 30) return 7.5
  // Za pakete preko 30kg, možemo koristiti 7.50€ ili dodati dodatnu logiku
  return 7.5
}

/**
 * Parsira težinu iz stringa (npr. "1kg" -> 1, "5kg" -> 5)
 */
export function parseWeight(weight: string): number {
  const match = weight.match(/(\d+(?:\.\d+)?)/)
  return match ? parseFloat(match[1]) : 0
}



