import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../lib/supabase'

/**
 * Javni API endpoint za dohvaćanje postavki dostave
 * Koristi se u buying flow-u za obračun cijene dostave
 */
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabaseAdmin.from('settings').select('*')

    if (error) throw error

    // Pretvori u objekt { key: value }
    const settings: any = {}
    data?.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    // Ekstraktiraj shipping_cost postavke
    const shippingCost = settings.shipping_cost || {
      tiers: [
        { maxWeight: 20, price: 6.0 },
        { maxWeight: 30, price: 7.5 },
      ],
    }

    // Osiguraj da tiers postoje i sortiraj ih
    const tiers = shippingCost.tiers || [
      { maxWeight: 20, price: 6.0 },
      { maxWeight: 30, price: 7.5 },
    ]

    // Sortiraj tiers po maxWeight
    tiers.sort((a: any, b: any) => a.maxWeight - b.maxWeight)

    // Maksimalna težina paketa je najveći maxWeight iz tiers-a
    const maxPackageWeight = tiers.length > 0 ? tiers[tiers.length - 1].maxWeight : 30

    return new Response(
      JSON.stringify({
        tiers,
        maxPackageWeight,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache 5 minuta
        },
      }
    )
  } catch (error) {
    console.error('Error fetching shipping settings:', error)

    // Vrati default postavke u slučaju greške
    return new Response(
      JSON.stringify({
        tiers: [
          { maxWeight: 20, price: 6.0 },
          { maxWeight: 30, price: 7.5 },
        ],
        maxPackageWeight: 30,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

