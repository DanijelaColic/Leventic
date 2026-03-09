export type ShippingTier = {
  maxWeight: number
  price: number
}

type ShippingSettings = {
  tiers: ShippingTier[]
  maxPackageWeight: number // Maksimalna težina jednog paketa (default 30kg)
}

// Defaultne postavke dostave
const defaultShippingSettings: ShippingSettings = {
  tiers: [
    { maxWeight: 20, price: 6.0 },
    { maxWeight: 30, price: 7.5 },
  ],
  maxPackageWeight: 30,
}

// Cache za postavke dostave (osvježava se svakih 5 minuta)
let shippingSettingsCache: ShippingSettings | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minuta

/**
 * Dohvaća postavke dostave iz API-ja ili koristi cache
 */
async function getShippingSettings(): Promise<ShippingSettings> {
  const now = Date.now()

  // Ako je cache valjan, koristi ga
  if (shippingSettingsCache && now - cacheTimestamp < CACHE_DURATION) {
    return shippingSettingsCache
  }

  try {
    const response = await fetch('/api/shipping-settings')
    
    if (response.ok) {
      const data = await response.json()
      
      const settings: ShippingSettings = {
        tiers: data.tiers || defaultShippingSettings.tiers,
        maxPackageWeight: data.maxPackageWeight || defaultShippingSettings.maxPackageWeight,
      }

      // Sortiraj tiers po maxWeight (od najmanjeg prema najvećem)
      settings.tiers.sort((a, b) => a.maxWeight - b.maxWeight)

      // Ažuriraj cache
      shippingSettingsCache = settings
      cacheTimestamp = now
      return settings
    }
  } catch (error) {
    console.warn('Error fetching shipping settings, using defaults:', error)
  }

  // Fallback na default postavke
  return defaultShippingSettings
}

/**
 * Pronalazi najbolji tier za određenu težinu
 * Traži najmanji tier koji pokriva težinu (najjeftiniji odgovarajući)
 */
function findTierForWeight(weight: number, tiers: ShippingTier[]): ShippingTier | null {
  if (tiers.length === 0) return null
  
  // Pronađi najmanji tier koji pokriva ovu težinu (najjeftiniji)
  // Tiers su već sortirani po maxWeight (od najmanjeg prema najvećem)
  for (let i = 0; i < tiers.length; i++) {
    if (weight <= tiers[i].maxWeight) {
      return tiers[i]
    }
  }
  // Ako težina prelazi sve tiers, koristi najveći dostupan
  return tiers[tiers.length - 1]
}

/**
 * Izračunava cijenu dostave na temelju ukupne težine proizvoda
 * Implementira optimiziranu logiku za više paketa:
 * - Paketi se popunjavaju do maksimalno 30kg
 * - Ako ostatak prelazi 20kg, koristi se paket do 30kg (7,50€)
 * - Ako ostatak je do 20kg, koristi se paket do 20kg (6,00€)
 * @param totalWeightKg - Ukupna težina u kilogramima
 * @returns Cijena dostave u eurima
 */
export async function calculateShipping(totalWeightKg: number): Promise<number> {
  if (totalWeightKg <= 0) return 0

  const settings = await getShippingSettings()
  const { tiers } = settings

  if (tiers.length === 0) return 0

  // Sortiraj tiers po maxWeight da imamo predvidljive cijene
  const sortedTiers = [...tiers].sort((a, b) => a.maxWeight - b.maxWeight)
  
  // Pretpostavljamo standardne tiers: 20kg=6€, 30kg=7.5€
  const tier20kg = sortedTiers.find(t => t.maxWeight === 20) || { maxWeight: 20, price: 6.0 }
  const tier30kg = sortedTiers.find(t => t.maxWeight === 30) || { maxWeight: 30, price: 7.5 }

  return calculateOptimalShippingCost(totalWeightKg, tier20kg.price, tier30kg.price)
}

/**
 * Optimizirana logika obračuna dostave
 */
function calculateOptimalShippingCost(totalWeightKg: number, price20kg: number, price30kg: number): number {
  if (totalWeightKg <= 0) return 0
  if (totalWeightKg <= 20) return price20kg
  if (totalWeightKg <= 30) return price30kg

  // Za težinu > 30kg, optimalno pakiranje
  let totalCost = 0
  let remainingWeight = totalWeightKg

  // Popuni pakete od 30kg koliko god možeš
  const fullPackages30kg = Math.floor(remainingWeight / 30)
  totalCost += fullPackages30kg * price30kg
  remainingWeight -= fullPackages30kg * 30

  // Za ostatak: ako je ≤20kg koristi jeftiniji paket, inače paket do 30kg
  if (remainingWeight > 0) {
    if (remainingWeight <= 20) {
      totalCost += price20kg  // Jeftiniji paket za ostatak ≤20kg
    } else {
      totalCost += price30kg  // Paket do 30kg za ostatak >20kg
    }
  }

  return totalCost
}

/**
 * Synchronous verzija koja koristi cache ili default postavke
 * Koristi se kada ne možemo čekati async poziv
 */
export function calculateShippingSync(totalWeightKg: number): number {
  if (totalWeightKg <= 0) return 0

  // Koristi cache ako postoji, inače default postavke
  const settings = shippingSettingsCache || defaultShippingSettings
  const { tiers } = settings

  if (tiers.length === 0) return 0

  // Sortiraj tiers po maxWeight da imamo predvidljive cijene
  const sortedTiers = [...tiers].sort((a, b) => a.maxWeight - b.maxWeight)
  
  // Pretpostavljamo standardne tiers: 20kg=6€, 30kg=7.5€
  const tier20kg = sortedTiers.find(t => t.maxWeight === 20) || { maxWeight: 20, price: 6.0 }
  const tier30kg = sortedTiers.find(t => t.maxWeight === 30) || { maxWeight: 30, price: 7.5 }

  return calculateOptimalShippingCost(totalWeightKg, tier20kg.price, tier30kg.price)
}

/**
 * Parsira težinu iz stringa u kilogramima.
 * Podržava: "1kg" → 1, "5kg" → 5, "400gr" → 0.4, "400g" → 0.4
 * Fallback: izvuče prvi broj i pretpostavi kg (npr. varijanta "1" → 1)
 */
export function parseWeight(weight: string): number {
  // Prvo traži kg
  const kgMatch = weight.match(/(\d+(?:\.\d+)?)\s*kg\b/i)
  if (kgMatch) return parseFloat(kgMatch[1])

  // Traži grame (g ili gr) — pretvori u kg
  const gMatch = weight.match(/(\d+(?:\.\d+)?)\s*gr?\b/i)
  if (gMatch) return parseFloat(gMatch[1]) / 1000

  // Fallback: izvuci prvi broj (pretpostavi kg — za varijante poput "1", "5")
  const numMatch = weight.match(/(\d+(?:\.\d+)?)/)
  return numMatch ? parseFloat(numMatch[1]) : 0
}



