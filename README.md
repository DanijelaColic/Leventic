# Eko Leventić - Astro Web Shop

Moderna web stranica i web shop za OPG Mario Leventić - ekološke proizvode, izgrađena s Astro frameworkom.

## Tehnologije

- Astro 4
- React 18 (za interaktivne komponente)
- TypeScript
- Tailwind CSS
- LocalStorage za košaricu

## Pokretanje projekta

1. Instaliraj dependencies:
```bash
npm install
```

2. Pokreni development server:
```bash
npm run dev
```

3. Otvori [http://localhost:4321](http://localhost:4321) u browseru

## Build za produkciju

```bash
npm run build
```

Build output će biti u `dist/` folderu.

## Struktura projekta

- `src/pages/` - Astro stranice (file-based routing)
- `src/components/` - Astro i React komponente
- `src/layouts/` - Layout komponente
- `src/context/` - React Context za košaricu
- `src/data/` - Podaci o proizvodima
- `src/styles/` - Globalni CSS stilovi

## Funkcionalnosti

- ✅ Početna stranica s informacijama o OPG-u
- ✅ Shop stranica s 5 proizvoda
- ✅ Shopping cart funkcionalnost (React island)
- ✅ Kontakt stranica s Google Maps
- ✅ Responsive design
- ✅ LocalStorage za perzistenciju košarice

## Astro Islands

Shopping cart funkcionalnost koristi Astro Islands pattern - React komponente se učitavaju samo gdje je potrebna interaktivnost, dok su ostale stranice statičke Astro komponente za bolje performanse.
