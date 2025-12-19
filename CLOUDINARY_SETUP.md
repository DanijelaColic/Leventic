# Cloudinary Setup za Upload Slika

## 1. Registracija na Cloudinary

1. Idite na https://cloudinary.com
2. Kliknite "Sign Up for Free"
3. Registrirajte se s email adresom
4. Potvrdite email

## 2. Dobivanje API ključeva

1. Nakon prijave, idite na **Dashboard**
2. Kopirajte **Cloud Name** (npr. "dxyz123abc")
3. Zapišite ga - trebat će vam za .env file

## 3. Kreiranje Upload Preset

1. U Cloudinary dashboardu idite na **Settings** (zupčanik)
2. Kliknite **Upload** tab
3. Scroll dolje do **Upload presets**
4. Kliknite **Add upload preset**
5. Postavke:
   - **Preset name**: `eko-leventic`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `products` (opcionalno)
   - **Transformation**: 
     - Width: 800
     - Height: 800
     - Crop: Limit
     - Quality: Auto
     - Format: Auto
6. Kliknite **Save**

## 4. Environment varijable

Dodajte u vaš `.env` file:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=vaš_cloud_name_ovdje
```

**Primjer:**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
```

## 5. Testiranje

1. Restartajte development server (`npm run dev`)
2. Idite u Admin → Proizvodi → Dodaj proizvod
3. Povucite sliku u upload zonu
4. Slika će se automatski uploadati na Cloudinary

## Prednosti ovog pristupa

✅ **Besplatno** - 25GB storage, 25GB bandwidth mjesečno
✅ **Automatska optimizacija** - slike se kompresiraju za web
✅ **CDN** - brže učitavanje slika širom svijeta  
✅ **Backup** - slike su sigurno pohranjene u cloudu
✅ **Jednostavno** - drag & drop upload u admin sučelju

## Troubleshooting

**Problem**: Upload ne radi
- Provjerite je li `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` ispravno postavljen
- Provjerite je li upload preset `eko-leventic` kreiran kao `Unsigned`
- Restartajte development server

**Problem**: Slike su prevelike
- Cloudinary će automatski optimizirati slike
- Možete postaviti manje dimenzije u upload preset-u

## Alternativa: Ručni URL

Ako ne želite koristiti Cloudinary, i dalje možete unijeti URL slike ručno u polje na dnu upload komponente.
