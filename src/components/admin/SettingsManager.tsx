import React, { useState, useEffect } from 'react'

type ShippingTier = {
  maxWeight: number
  price: number
}

type Settings = {
  shipping_cost: {
    tiers: ShippingTier[]
    free_above: number
  }
  currency: string
  tax_rate: number
}

// Defaultne postavke dostave prema težini (kao u shipping.ts)
const defaultSettings: Settings = {
  shipping_cost: {
    tiers: [
      { maxWeight: 20, price: 6.0 },
      { maxWeight: 30, price: 7.5 },
    ],
    free_above: 0, // 0 = nema besplatne dostave
  },
    currency: 'EUR',
    tax_rate: 0.25,
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()

        // Kompatibilnost sa starim formatom postavki
        // Ako su postavke u starom formatu (default/free_above), pretvori u novi format (tiers)
        if (data.shipping_cost) {
          if (!data.shipping_cost.tiers && typeof data.shipping_cost.default === 'number') {
            // Stari format - pretvori u novi
            data.shipping_cost = {
              tiers: defaultSettings.shipping_cost.tiers,
              free_above: data.shipping_cost.free_above || 0,
            }
          }
        } else {
          // Nema shipping_cost uopće - koristi default
          data.shipping_cost = defaultSettings.shipping_cost
        }

        // Osiguraj da postoje svi potrebni ključevi
        setSettings({
          ...defaultSettings,
          ...data,
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('Postavke su uspješno spremljene!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Greška pri spremanju postavki')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Greška pri spremanju postavki')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Učitavanje postavki...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Postavke trgovine
      </h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Troškovi dostave */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Troškovi dostave (prema težini)</h3>

            <div className="space-y-4">
              {/* Prikaz shipping tier-ova */}
              {settings.shipping_cost.tiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maksimalna težina (kg)
                </label>
                <input
                  type="number"
                      step="1"
                      min="1"
                      value={tier.maxWeight}
                      onChange={(e) => {
                        const newTiers = [...settings.shipping_cost.tiers]
                        newTiers[index] = {
                          ...newTiers[index],
                          maxWeight: parseFloat(e.target.value) || 0,
                        }
                    setSettings({
                      ...settings,
                      shipping_cost: {
                        ...settings.shipping_cost,
                            tiers: newTiers,
                      },
                    })
                      }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cijena dostave (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                      min="0"
                      value={tier.price}
                      onChange={(e) => {
                        const newTiers = [...settings.shipping_cost.tiers]
                        newTiers[index] = {
                          ...newTiers[index],
                          price: parseFloat(e.target.value) || 0,
                        }
                    setSettings({
                      ...settings,
                      shipping_cost: {
                        ...settings.shipping_cost,
                            tiers: newTiers,
                      },
                    })
                      }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                  </div>

                  {/* Gumb za brisanje tier-a (samo ako ima više od jednog) */}
                  {settings.shipping_cost.tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newTiers = settings.shipping_cost.tiers.filter(
                          (_, i) => i !== index
                        )
                        setSettings({
                          ...settings,
                          shipping_cost: {
                            ...settings.shipping_cost,
                            tiers: newTiers,
                          },
                        })
                      }}
                      className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Ukloni razinu"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
              </div>
              ))}

              {/* Gumb za dodavanje novog tier-a */}
              <button
                type="button"
                onClick={() => {
                  const lastTier =
                    settings.shipping_cost.tiers[
                      settings.shipping_cost.tiers.length - 1
                    ]
                  const newTier = {
                    maxWeight: lastTier ? lastTier.maxWeight + 10 : 20,
                    price: lastTier ? lastTier.price + 1.5 : 6.0,
                  }
                  setSettings({
                    ...settings,
                    shipping_cost: {
                      ...settings.shipping_cost,
                      tiers: [...settings.shipping_cost.tiers, newTier],
                    },
                  })
                }}
                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-500 hover:text-green-600 transition"
              >
                + Dodaj razinu dostave
              </button>
            </div>

            {/* Info box s trenutnim postavkama */}
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">
                📦 Trenutne postavke dostave:
              </p>
              <ul className="text-sm text-green-700 space-y-1 mb-3">
                {settings.shipping_cost.tiers.map((tier, index) => {
                  const prevMax =
                    index === 0
                      ? 0
                      : settings.shipping_cost.tiers[index - 1].maxWeight
                  return (
                    <li key={index}>
                      • Paket {prevMax > 0 ? `od ${prevMax}kg ` : ''}do{' '}
                      {tier.maxWeight}kg težine:{' '}
                      <strong>{tier.price.toFixed(2)} €</strong>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-3 pt-3 border-t border-green-300">
                <p className="text-xs font-semibold text-green-800 mb-1">
                  ℹ️ Kako funkcionira obračun:
                </p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>
                    • Maksimalna težina jednog paketa:{' '}
                    <strong>
                      {settings.shipping_cost.tiers.length > 0
                        ? settings.shipping_cost.tiers[
                            settings.shipping_cost.tiers.length - 1
                          ].maxWeight
                        : 30}
                      kg
                    </strong>
                  </li>
                  <li>
                    • Ako narudžba prelazi maksimalnu težinu, obračunava se
                    trošak za više paketa
                  </li>
                  <li>
                    • Primjer: narudžba od 45kg = 2 paketa (1×30kg = 7,50€ +
                    1×15kg = 6,00€) = <strong>13,50€</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Valuta */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Valuta</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valuta trgovine
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="EUR">EUR (€)</option>
                <option value="HRK">HRK (kn)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Porez */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Porez</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stopa PDV-a (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.tax_rate * 100}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    tax_rate: parseFloat(e.target.value) / 100 || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Trenutna stopa: {(settings.tax_rate * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Poruka o uspjehu */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('uspješno')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {/* Gumb za spremanje */}
          <div className="border-t pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Spremanje...' : 'Spremi postavke'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

