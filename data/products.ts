export interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  emoji: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Eko bijelo pirovo brašno',
    description:
      'Fino mljeveno bijelo brašno od trozrnog pira (Hildegardin pir). Mljeveno u mlinu sa eko certifikatom. Idealno za pečenje kruha, peciva i kolača.',
    price: 5.5,
    unit: 'kg',
    emoji: '🌾',
  },
  {
    id: '2',
    name: 'Eko integralno pirovo brašno',
    description:
      'Integralno brašno od trozrnog pira s cijelim zrnom. Bogato vlaknima i hranjivim tvarima. Mljeveno u mlinu sa eko certifikatom.',
    price: 6.0,
    unit: 'kg',
    emoji: '🌾',
  },
  {
    id: '3',
    name: 'Eko integralni pirov griz',
    description:
      'Krupno mljeveni integralni pirov griz. Idealan za pripremu kaša, tjestenine i tradicionalnih jela. Od trozrnog pira s eko certifikatom.',
    price: 5.8,
    unit: 'kg',
    emoji: '🌾',
  },
  {
    id: '4',
    name: 'Eko pir (Hildegardin pir)',
    description:
      'Trozrni pravi pir (Triticum spelta) s eko certifikatom. Genetski potvrđen autentični Hildegardin pir. Uzgojen na ekološki način.',
    price: 4.5,
    unit: 'kg',
    emoji: '🌾',
  },
  {
    id: '5',
    name: 'Eko pšenično brašno',
    description:
      'Ekološki mljeveno pšenično brašno iz vlastite proizvodnje. Bez dodataka i konzervansa. Oznaka "Brašno Hrvatskih polja".',
    price: 3.5,
    unit: 'kg',
    emoji: '🥖',
  },
]

