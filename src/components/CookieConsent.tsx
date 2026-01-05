import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'eko-leventic-cookie-consent'
const COOKIE_CONSENT_EXPIRY_DAYS = 365 // 12 mjeseci

interface CookieConsent {
  accepted: boolean
  timestamp: number
  necessary: boolean
  functional: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Ne prikazuj cookie consent na admin stranicama
    if (window.location.pathname.startsWith('/admin')) {
      return
    }
    
    // Provjeri da li je korisnik već dao pristanak
    const consent = getCookieConsent()
    
    if (!consent || !consent.accepted) {
      // Pričekaj malo da se stranica učita prije nego što prikažeš banner
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const getCookieConsent = (): CookieConsent | null => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (!stored) return null
      
      const consent: CookieConsent = JSON.parse(stored)
      
      // Provjeri da li je pristanak istekao (nakon 12 mjeseci)
      const expiryTime = consent.timestamp + COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      if (Date.now() > expiryTime) {
        localStorage.removeItem(COOKIE_CONSENT_KEY)
        return null
      }
      
      return consent
    } catch {
      return null
    }
  }

  const saveCookieConsent = (necessary: boolean, functional: boolean) => {
    const consent: CookieConsent = {
      accepted: true,
      timestamp: Date.now(),
      necessary,
      functional,
    }
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleAcceptAll = () => {
    saveCookieConsent(true, true)
  }

  const handleAcceptNecessary = () => {
    saveCookieConsent(true, false)
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handleSaveSettings = (necessary: boolean, functional: boolean) => {
    saveCookieConsent(necessary, functional)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-green-600 shadow-2xl p-4 md:p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon and Text */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🍪</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Koristimo kolačiće
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Naša web stranica koristi kolačiće kako bismo osigurali pravilno funkcioniranje 
                    stranice i poboljšali vaše korisničko iskustvo. Kolačići nam pomažu zapamtiti 
                    vašu košaricu i omogućiti vam jednostavniju kupovinu.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Više informacija možete pronaći u našoj{' '}
                    <a
                      href="/politika-privatnosti"
                      className="text-green-600 hover:text-green-700 underline font-medium"
                    >
                      Politici privatnosti
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition whitespace-nowrap"
              >
                Samo nužni
              </button>
              <button
                onClick={handleOpenSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition whitespace-nowrap"
              >
                Postavke
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition whitespace-nowrap"
              >
                Prihvati sve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🍪</span> Postavke kolačića
                </h2>
                <button
                  onClick={handleCloseSettings}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  aria-label="Zatvori"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                Odaberite koje kolačiće želite prihvatiti. Nužni kolačići su potrebni za 
                osnovno funkcioniranje stranice i ne mogu se isključiti.
              </p>

              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">Nužni kolačići</h3>
                    <p className="text-sm text-gray-600">
                      Potrebni za osnovno funkcioniranje stranice
                    </p>
                  </div>
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-medium">
                    Uvijek aktivni
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Ovi kolačići su potrebni za osnovno funkcioniranje web stranice i ne mogu 
                  se isključiti. Uključuju kolačiće za autentifikaciju i sigurnost.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">Funkcionalni kolačići</h3>
                    <p className="text-sm text-gray-600">
                      Poboljšavaju korisničko iskustvo
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="functional-cookies"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Ovi kolačići omogućavaju web stranici da zapamti vaše odluke (npr. košarica, 
                  preferencije) i pružaju poboljšanu funkcionalnost.
                </p>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
                  <li>Košarica - zapamćivanje proizvoda u košarici</li>
                  <li>Narudžbe - zapamćivanje informacija o narudžbama</li>
                </ul>
              </div>

              {/* Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Napomena:</strong> Vaše postavke će biti spremljene i primjenjivane 
                  na svim stranicama. Možete promijeniti postavke u bilo kojem trenutku.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleCloseSettings}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Odustani
                </button>
                <button
                  onClick={() => {
                    const functionalChecked = (
                      document.getElementById('functional-cookies') as HTMLInputElement
                    )?.checked ?? true
                    handleSaveSettings(true, functionalChecked)
                  }}
                  className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                >
                  Spremi postavke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Helper funkcija za provjeru pristanka (može se koristiti u drugim komponentama)
export function hasCookieConsent(): boolean {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) return false
    
    const consent: CookieConsent = JSON.parse(stored)
    return consent.accepted === true
  } catch {
    return false
  }
}

// Helper funkcija za provjeru funkcionalnih kolačića
export function hasFunctionalCookieConsent(): boolean {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) return false
    
    const consent: CookieConsent = JSON.parse(stored)
    return consent.accepted === true && consent.functional === true
  } catch {
    return false
  }
}

