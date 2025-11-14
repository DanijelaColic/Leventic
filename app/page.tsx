import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
            Eko Leventić
          </h1>
          <p className="text-2xl md:text-3xl text-primary-700 mb-6 font-semibold">
            Zlatna zrna slavonskih polja
          </p>
          <blockquote className="text-lg md:text-xl text-gray-700 italic mb-8 max-w-3xl mx-auto border-l-4 border-primary-500 pl-6">
            "Proizvesti zdravo, očuvati zdravlje svoje i onih nama dragih, živjeti
            u skladu sa prirodom i educirati ljude, da prepoznaju opasnosti
            konvencionalne poljoprivrede."
          </blockquote>
          <Link
            href="/shop"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Pregledaj proizvode
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8 text-center">
            O nama
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              OPG Mario Leventić otvoren je 2009. godine sa sjedištem u Čepinu.
              Od 2011. godine bavimo se isključivo eko proizvodnjom na 47 ha
              obradive površine. Uzgajamo krmne i ratarske kulture. Već 9 godina
              OPG je pod kontinuiranim nadzorom ovlaštene tvrtke za dodjelu EKO
              certifikata.
            </p>
            <p className="text-gray-700 mb-4">
              Na ekološkom obiteljskom poljoprivrednom gospodarstvu radi mladi
              bračni par, Mario i Marijana Leventić.
            </p>
            <p className="text-gray-700 mb-4">
              Budući da se cijeli naš uzgoj žitarica temelji na prirodnom
              procesu, bez sintetskih gnojiva i pesticida, cilj i želja nam je
              razviti svijest o važnosti konzumacije ekoloških proizvoda. Nudimo
              proizvode koji su izvorno prirodno netaknuti, jer priroda se sama
              pobrinula da kao takvi budu savršeni.
            </p>
            <p className="text-gray-700 mb-4">
              Naš pir uzgojen na ekološki način sa certifikatom prerađujemo u
              mlinu sa eko certifikatom u kojemu se melje samo pir. Trudimo se
              udovoljiti svim vašim potrebama i željama te se većina naših
              proizvoda može naručiti bez čekanja. Trudimo se da naručeni
              proizvodi budu što brže isporučeni.
            </p>
            <p className="text-gray-700 mb-4">
              Iako domaći ekološki proizvodi zahtijevaju mnogo truda, cilj nam je
              zadovoljan kupac koji se stalno vraća, stoga je i cijena vrlo bitna
              i kod nas primamljiva.
            </p>
            <p className="text-gray-700">
              Posjedujemo eko certifikat pira, eko certifikat mlina i potvrdu
              genetske analize pira da je pir koji uzgajamo trozrni, pravi pir
              (Triticum spelta) ili tzv. Hildegardin pir. Ponosni smo vlasnici
              oznake "Brašno Hrvatskih polja".
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
              Zašto odabrati naše proizvode?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Eko certifikat
                </h3>
                <p className="text-gray-700">
                  Kontinuirani nadzor ovlaštene tvrtke za dodjelu EKO
                  certifikata
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Prirodna proizvodnja
                </h3>
                <p className="text-gray-700">
                  Bez sintetskih gnojiva i pesticida, samo prirodni procesi
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Kvaliteta
                </h3>
                <p className="text-gray-700">
                  Genetska analiza potvrđuje autentičnost našeg trozrnog pira
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

