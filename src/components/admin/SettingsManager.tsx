import React, { useState, useEffect } from 'react'

type Settings = {
  shipping_cost: {
    default: number
    free_above: number
  }
  currency: string
  tax_rate: number
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({
    shipping_cost: { default: 5.0, free_above: 50.0 },
    currency: 'EUR',
    tax_rate: 0.25,
  })
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
        setSettings(data)
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
            <h3 className="text-lg font-semibold mb-4">Troškovi dostave</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Osnovna cijena dostave (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.shipping_cost.default}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping_cost: {
                        ...settings.shipping_cost,
                        default: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Standardni trošak dostave
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Besplatna dostava od (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.shipping_cost.free_above}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping_cost: {
                        ...settings.shipping_cost,
                        free_above: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Iznos za besplatnu dostavu
                </p>
              </div>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Trenutna postavka:</strong> Dostava košta €
                {settings.shipping_cost.default.toFixed(2)}, besplatna za narudžbe
                preko €{settings.shipping_cost.free_above.toFixed(2)}
              </p>
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

