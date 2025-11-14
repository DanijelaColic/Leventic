export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-8 text-center">
          Kontakt
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            OPG Mario Leventić
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Adresa:</strong> Osječka 118, 31431 Čepin
            </p>
            <p>
              <strong>E-mail:</strong>{' '}
              <a
                href="mailto:info@eko-leventic.hr"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                info@eko-leventic.hr
              </a>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            Lokacija
          </h2>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Osječka+118,+31431+Čepin&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="OPG Mario Leventić - Osječka 118, 31431 Čepin"
            ></iframe>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Osječka+118,+31431+Čepin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Otvori u Google Maps
            </a>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            Kontaktirajte nas
          </h2>
          <p className="text-gray-700 mb-6">
            Za narudžbe i informacije možete nas kontaktirati putem:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="viber://chat"
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.055 0C6.855 0 1.8 5.055 1.8 11.255c0 1.98.51 3.84 1.41 5.46L0 24l7.515-3.21c1.56.84 3.33 1.35 5.25 1.35 6.21 0 11.265-5.055 11.265-11.265C24.03 5.055 18.975 0 13.055 0zm6.48 15.705c-.24.66-.75 1.23-1.38 1.59-.45.27-1.05.54-1.83.75-.6.15-1.38.24-2.4.24-2.07 0-4.65-.75-6.75-2.25-2.7-1.95-4.35-4.8-4.35-7.95 0-1.05.15-1.95.45-2.7.3-.75.75-1.35 1.35-1.8.6-.45 1.2-.6 1.8-.6.24 0 .45.03.66.09.21.06.39.15.54.27.15.12.27.27.36.45.09.18.15.39.18.63.03.24.03.51 0 .81-.03.3-.09.63-.18.99-.09.36-.21.75-.36 1.17-.15.42-.33.87-.54 1.35-.21.48-.45.99-.72 1.53-.27.54-.57 1.11-.9 1.71-.33.6-.69 1.23-1.08 1.89-.39.66-.81 1.35-1.26 2.07-.45.72-.93 1.47-1.44 2.25-.51.78-1.05 1.59-1.62 2.43-.57.84-1.17 1.71-1.8 2.61-.63.9-1.29 1.83-1.98 2.79-.69.96-1.41 1.95-2.16 2.97-.75 1.02-1.53 2.07-2.34 3.15-.81 1.08-1.65 2.19-2.52 3.33-.87 1.14-1.77 2.31-2.7 3.51-.93 1.2-1.89 2.43-2.88 3.69-.99 1.26-2.01 2.55-3.06 3.87-1.05 1.32-2.13 2.67-3.24 4.05-1.11 1.38-2.25 2.79-3.42 4.23-1.17 1.44-2.37 2.91-3.6 4.41-1.23 1.5-2.49 3.03-3.78 4.59-.129.156-.258.312-.387.468z" />
              </svg>
              Viber
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

