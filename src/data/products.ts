export type NutritionInfo = {
  energy: string
  fat: string
  saturatedFat?: string
  carbs: string
  sugars?: string
  fiber?: string
  protein: string
  salt?: string
}

export type ProductVariant = {
  weight: string // "1kg", "5kg", "10kg"
  price: number
}

export type Product = {
  id: string
  name: string
  description: string
  price: number // Base price (lowest variant)
  unit: string
  emoji: string
  image: string
  images?: string[] // Dodatne slike proizvoda
  variants?: ProductVariant[] // Opcije za težinu
  detailedDescription?: string
  usage?: string
  ingredients?: string
  notes?: string
  storage?: string
  expiry?: string
  nutrition?: NutritionInfo
  available?: boolean
}

export const products: Product[] = [
  // Eko bijelo pirovo brašno - 3 veličine
  {
    id: '1',
    name: 'Eko bijelo pirovo brašno 1kg',
    description:
      'Fino mljeveno bijelo brašno od trozrnog pira (Hildegardin pir). Mljeveno u mlinu sa eko certifikatom. Idealno za pečenje kruha, peciva i kolača.',
    price: 2.4,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_bijelo_pirovo_brasno_1kg.jpg',
    images: [
      '/Eko_bijelo_pirovo_brasno_1kg.jpg',
      '/Eko_bijelo_pirovo_brasno_kruh.jpg',
      '/Eko_bijelo_pirovo_brasno_kolac.jpg',
    ],
    detailedDescription:
      'Pir (lat. Triticum spelta) je žitarica koju nazivaju praiskonskom pšenicom jer stoljećima nije modificiran i do današnjice je zadržao prvotne karakteristike.\n\nPirovo bijelo brašno sadrži gluten, ali u značajno manjoj količini nego pšenično brašno. Razlikuje se od integralnog pirovog brašna u tome što ne sadrži vanjski sloj i klicu, odnosno nije brašno od cjelovitog zrna. Okusom podsjeća na orašaste plodove i blago je slatkastog okusa koji je sličan okusu integralnog pšeničnog brašna.',
    usage:
      'U kulinarstvu pirovo bijelo brašno uspješno zamjenjuje bilo koje drugo brašno u potpunosti ili se miješa u omjeru 1:1 sa brašnom iz izvornog recepta.\n\nBrašno se koristi i za kuhanje (npr. zgušnjavanje), ali je potrebno izbjegavati vrlo visoke temperature kuhanja.\n\nZbog manjeg udjela glutena brašno se ne smije puno mijesiti jer će u protivnom nastati mrvljiva tekstura te u usporedbi sa pšeničnim ima veću topivost u vodi tako da je u izradi tijesta potrebna manja količina tekućine.\n\nU nekim izvorima preporuka je količinu tekućine iz izvornog recepta smanjiti za 25%. Također, tijesta od pirovog bijelog brašna neće narasti jednako kao i ona od pšeničnog brašna, ali ih je u pravilu puno lakše razvaljati tako da je ovo brašno idealno za izradu savijača i sličnih delicija.',
    ingredients: '100% pirovo bijelo brašno (lat.Triticum spelta)',
    notes: 'Proizvod sadrži gluten.',
    storage: 'Čuvati na suhom, hladnom i tamnom mjestu.',
    expiry: 'Istaknut na pakiranju.',
    nutrition: {
      energy: '1412 kJ / 334 kcal',
      fat: '2,26 g',
      saturatedFat: '0,51 g',
      carbs: '62,47 g',
      sugars: '3,04 g',
      fiber: '5,93 g',
      protein: '12,9 g',
      salt: '< 0,01 g',
    },
  },
  {
    id: '2',
    name: 'Eko bijelo pirovo brašno 5kg',
    description:
      'Fino mljeveno bijelo brašno od trozrnog pira (Hildegardin pir). Mljeveno u mlinu sa eko certifikatom. Idealno za pečenje kruha, peciva i kolača. Pakiranje od 5kg.',
    price: 11.0,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_bijelo_pirovo_brasno_5kg.jpg',
    images: [
      '/Eko_bijelo_pirovo_brasno_5kg.jpg',
      '/Eko_bijelo_pirovo_brasno_kruh.jpg',
      '/Eko_bijelo_pirovo_brasno_kolac.jpg',
    ],
    detailedDescription:
      'Pir (lat. Triticum spelta) je žitarica koju nazivaju praiskonskom pšenicom jer stoljećima nije modificiran i do današnjice je zadržao prvotne karakteristike.\n\nPirovo bijelo brašno sadrži gluten, ali u značajno manjoj količini nego pšenično brašno. Razlikuje se od integralnog pirovog brašna u tome što ne sadrži vanjski sloj i klicu, odnosno nije brašno od cjelovitog zrna. Okusom podsjeća na orašaste plodove i blago je slatkastog okusa koji je sličan okusu integralnog pšeničnog brašna.',
    usage:
      'U kulinarstvu pirovo bijelo brašno uspješno zamjenjuje bilo koje drugo brašno u potpunosti ili se miješa u omjeru 1:1 sa brašnom iz izvornog recepta.\n\nBrašno se koristi i za kuhanje (npr. zgušnjavanje), ali je potrebno izbjegavati vrlo visoke temperature kuhanja.\n\nZbog manjeg udjela glutena brašno se ne smije puno mijesiti jer će u protivnom nastati mrvljiva tekstura te u usporedbi sa pšeničnim ima veću topivost u vodi tako da je u izradi tijesta potrebna manja količina tekućine.',
    ingredients: '100% pirovo bijelo brašno (lat.Triticum spelta)',
    notes: 'Proizvod sadrži gluten.',
    storage: 'Čuvati na suhom, hladnom i tamnom mjestu.',
    expiry: 'Istaknut na pakiranju.',
    nutrition: {
      energy: '1412 kJ / 334 kcal',
      fat: '2,26 g',
      saturatedFat: '0,51 g',
      carbs: '62,47 g',
      sugars: '3,04 g',
      fiber: '5,93 g',
      protein: '12,9 g',
      salt: '< 0,01 g',
    },
  },
  {
    id: '3',
    name: 'Eko bijelo pirovo brašno 10kg',
    description:
      'Fino mljeveno bijelo brašno od trozrnog pira (Hildegardin pir). Mljeveno u mlinu sa eko certifikatom. Idealno za pečenje kruha, peciva i kolača. Veliko pakiranje od 10kg.',
    price: 20.0,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_bijelo_pirovo_brasno_10kg.jpg',
    images: [
      '/Eko_bijelo_pirovo_brasno_10kg.jpg',
      '/Eko_bijelo_pirovo_brasno_kruh.jpg',
      '/Eko_bijelo_pirovo_brasno_kolac.jpg',
    ],
    detailedDescription:
      'Pir (lat. Triticum spelta) je žitarica koju nazivaju praiskonskom pšenicom jer stoljećima nije modificiran i do današnjice je zadržao prvotne karakteristike.\n\nPirovo bijelo brašno sadrži gluten, ali u značajno manjoj količini nego pšenično brašno. Razlikuje se od integralnog pirovog brašna u tome što ne sadrži vanjski sloj i klicu, odnosno nije brašno od cjelovitog zrna. Okusom podsjeća na orašaste plodove i blago je slatkastog okusa koji je sličan okusu integralnog pšeničnog brašna.',
    usage:
      'U kulinarstvu pirovo bijelo brašno uspješno zamjenjuje bilo koje drugo brašno u potpunosti ili se miješa u omjeru 1:1 sa brašnom iz izvornog recepta.\n\nBrašno se koristi i za kuhanje (npr. zgušnjavanje), ali je potrebno izbjegavati vrlo visoke temperature kuhanja.\n\nZbog manjeg udjela glutena brašno se ne smije puno mijesiti jer će u protivnom nastati mrvljiva tekstura te u usporedbi sa pšeničnim ima veću topivost u vodi tako da je u izradi tijesta potrebna manja količina tekućine.',
    ingredients: '100% pirovo bijelo brašno (lat.Triticum spelta)',
    notes: 'Proizvod sadrži gluten.',
    storage: 'Čuvati na suhom, hladnom i tamnom mjestu.',
    expiry: 'Istaknut na pakiranju.',
    nutrition: {
      energy: '1412 kJ / 334 kcal',
      fat: '2,26 g',
      saturatedFat: '0,51 g',
      carbs: '62,47 g',
      sugars: '3,04 g',
      fiber: '5,93 g',
      protein: '12,9 g',
      salt: '< 0,01 g',
    },
  },

  // Eko integralno pirovo brašno - 3 veličine
  {
    id: '4',
    name: 'Eko integralno pirovo brašno 1kg',
    description:
      'Integralno brašno od trozrnog pira s cijelim zrnom. Bogato vlaknima i hranjivim tvarima. Mljeveno u mlinu sa eko certifikatom.',
    price: 2.4,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_integralno_pirovo_brasno_1kg.jpg',
    images: [
      '/Eko_integralno_pirovo_brasno_1kg.jpg',
      '/Eko_integralno_pirovo_brasno_krekeri.jpg',
      '/Eko_integralno_pirovo_brasno_pizza.jpg',
    ],
    detailedDescription:
      'Pir (lat. Triticum spelta) je žitarica koju se smatra pretečom današnje pšenice. Stoljećima nije modificiran i do današnjice je zadržao prvotne karakteristike. Za dobivanje integralnog brašna od pira melje se cijelo zrno sa svim njegovim hranjivim dijelovima, odnosno melje se zrno sa vanjskom košuljicom koja je prepuna zdravih sastojaka i središnjim dijelom (endosperm).\n\nPirovo integralno brašno ima više bjelančevina, a manje kalorija od običnog pšeničnog brašna, te je lakše probavljivo.\n\nPo sadržaju bjelančevina, pir je na samom vrhu među žitaricama jer ih sadrži od 12 do 20%. Bjelančevine pira, odnosno gluten u piru, se strukturno razlikuju od pšeničnih bjelančevina i zbog toga ovo brašno dobro podnose ljudi koji su inače osjetljivi na bjelančevine drugih žitarica (primjerice, pšenice). Brašno nije pogodno za upotrebu osobama koje boluju od celijakije.',
    usage:
      'Zbog manjeg udjela glutena brašno se ne smije puno mijesiti jer će u protivnom nastati mrvljiva tekstura. U usporedbi sa pšeničnim brašnom ima veću topivost u vodi tako da je u izradi tijesta potrebna oko 25% manje tekućine.\n\nTakođer, tijesta od pirovog integralnog brašna neće narasti jednako kao i ona od pšeničnog brašna, ali ih je u pravilu puno lakše razvaljati tako da je ovo brašno idealno za izradu savijača i sličnih delicija. Koristi se i za izradu raznih ostalih kolača, palačinka, keksa, kruha, grisina i peciva.',
    ingredients: '100% pirovo integralno brašno (lat. Triticum spelta)',
    notes: 'Proizvod sadrži gluten.',
    storage: 'Čuvati na suhom, hladnom i tamnom mjestu.',
    expiry: 'Istaknut na pakiranju.',
    nutrition: {
      energy: '1331 kJ / 315 kcal',
      fat: '2,31 g',
      saturatedFat: '0,49 g',
      carbs: '56,91 g',
      sugars: '3,06 g',
      fiber: '8,16 g',
      protein: '12,52 g',
      salt: '< 0,01 g',
    },
  },
  {
    id: '5',
    name: 'Eko integralno pirovo brašno 5kg',
    description:
      'Integralno brašno od trozrnog pira s cijelim zrnom. Bogato vlaknima i hranjivim tvarima. Mljeveno u mlinu sa eko certifikatom. Pakiranje od 5kg.',
    price: 11.0,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_integralno_pirovo_brasno_5kg.jpg',
    images: [
      '/Eko_integralno_pirovo_brasno_5kg.jpg',
      '/Eko_integralno_pirovo_brasno_krekeri.jpg',
      '/Eko_integralno_pirovo_brasno_pizza.jpg',
    ],
    detailedDescription:
      'Pir (lat. Triticum spelta) je žitarica koju se smatra pretečom današnje pšenice. Stoljećima nije modificiran i do današnjice je zadržao prvotne karakteristike. Za dobivanje integralnog brašna od pira melje se cijelo zrno sa svim njegovim hranjivim dijelovima.\n\nPirovo integralno brašno ima više bjelančevina, a manje kalorija od običnog pšeničnog brašna, te je lakše probavljivo.',
    usage:
      'Zbog manjeg udjela glutena brašno se ne smije puno mijesiti jer će u protivnom nastati mrvljiva tekstura. U usporedbi sa pšeničnim brašnom ima veću topivost u vodi tako da je u izradi tijesta potrebna oko 25% manje tekućine.\n\nKoristi se i za izradu raznih kolača, palačinka, keksa, kruha, grisina i peciva.',
    ingredients: '100% pirovo integralno brašno (lat. Triticum spelta)',
    notes: 'Proizvod sadrži gluten.',
    storage: 'Čuvati na suhom, hladnom i tamnom mjestu.',
    expiry: 'Istaknut na pakiranju.',
    nutrition: {
      energy: '1331 kJ / 315 kcal',
      fat: '2,31 g',
      saturatedFat: '0,49 g',
      carbs: '56,91 g',
      sugars: '3,06 g',
      fiber: '8,16 g',
      protein: '12,52 g',
      salt: '< 0,01 g',
    },
  },
  {
    id: '6',
    name: 'Eko integralno pirovo brašno 10kg',
    description:
      'Integralno brašno od trozrnog pira s cijelim zrnom. Bogato vlaknima i hranjivim tvarima. Mljeveno u mlinu sa eko certifikatom. Veliko pakiranje od 10kg.',
    price: 20.0,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_integralno_pirovo_brasno_10kg.jpg',
    images: [
      '/Eko_integralno_pirovo_brasno_10kg.jpg',
      '/Eko_integralno_pirovo_brasno_krekeri.jpg',
      '/Eko_integralno_pirovo_brasno_pizza.jpg',
    ],
    detailedDescription:
      'Pir (lat. Triticum spelta) je žitarica koju se smatra pretečom današnje pšenice. Stoljećima nije modificiran i do današnjice je zadržao prvotne karakteristike. Za dobivanje integralnog brašna od pira melje se cijelo zrno sa svim njegovim hranjivim dijelovima.\n\nPirovo integralno brašno ima više bjelančevina, a manje kalorija od običnog pšeničnog brašna, te je lakše probavljivo.',
    usage:
      'Zbog manjeg udjela glutena brašno se ne smije puno mijesiti jer će u protivnom nastati mrvljiva tekstura. U usporedbi sa pšeničnim brašnom ima veću topivost u vodi tako da je u izradi tijesta potrebna oko 25% manje tekućine.\n\nKoristi se i za izradu raznih kolača, palačinka, keksa, kruha, grisina i peciva.',
    ingredients: '100% pirovo integralno brašno (lat. Triticum spelta)',
    notes: 'Proizvod sadrži gluten.',
    storage: 'Čuvati na suhom, hladnom i tamnom mjestu.',
    expiry: 'Istaknut na pakiranju.',
    nutrition: {
      energy: '1331 kJ / 315 kcal',
      fat: '2,31 g',
      saturatedFat: '0,49 g',
      carbs: '56,91 g',
      sugars: '3,06 g',
      fiber: '8,16 g',
      protein: '12,52 g',
      salt: '< 0,01 g',
    },
  },

  // Ostali proizvodi - samo 1kg
  {
    id: '7',
    name: 'Eko oljušteni pir 1kg',
    description:
      'Oljušteni pir (Hildegardin pir) od trozrnog pira. Prirodan, bez ljuske, spreman za kuhanje. Uzgojen na ekološki način s eko certifikatom.',
    price: 1.5,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_oljusteni_pir_1kg.jpg',
  },
  {
    id: '8',
    name: 'Eko oštro pirovo brašno 1kg',
    description:
      'Oštro mljeveno pirovo brašno od trozrnog pira. Fina tekstura, idealno za pečenje i kuhanje. Mljeveno u mlinu sa eko certifikatom.',
    price: 2.65,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_ostro_pirovo_brasno_1kg.jpg',
  },
  {
    id: '9',
    name: 'Eko integralni pirov griz 1kg',
    description:
      'Krupno mljeveni integralni pirov griz. Idealan za pripremu kaša, tjestenine i tradicionalnih jela. Od trozrnog pira s eko certifikatom.',
    price: 2.65,
    unit: 'kom',
    emoji: '🌾',
    image: '/Eko_integralni_pirov_griz_1kg.jpg',
  },
]

