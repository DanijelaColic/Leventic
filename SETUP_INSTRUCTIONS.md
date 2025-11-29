# ✅ Brze Upute za Postavljanje Admin Panela

## 🎯 Što ste dobili?

✅ **Admin panel** - Potpuno funkcionalan sa upravljanjem proizvodima, narudžbama i postavkama  
✅ **Supabase integracija** - Sve se sprema u cloud bazu podataka  
✅ **Automatsko bilježenje narudžbi** - Svaka nova narudžba se automatski prikazuje u admin panelu  

---

## 📋 KORACI ZA POKRETANJE (10 minuta)

### 1️⃣ Postavite Supabase Projekt

**a) Kreirajte novi projekt:**
1. Idite na https://supabase.com
2. Kliknite "New Project"
3. Unesite:
   - Project name: `eko-leventic`
   - Database password: (zapamtite!)
   - Region: Europe West
4. Kliknite "Create new project" (pričekajte 1-2 min)

**b) Pokrenite SQL skriptu:**
1. U Supabase dashboardu → **SQL Editor** (lijevi meni)
2. Kliknite "New query"
3. Otvorite fajl `supabase-schema.sql` u vašem projektu
4. Kopirajte CIJELI sadržaj
5. Zalijepite u SQL Editor
6. Kliknite **RUN** (ili Ctrl+Enter)
7. Trebali biste vidjeti: ✅ "Success. No rows returned"

**c) Kopirajte API ključeve:**
1. Project Settings (zupčanik ikona dolje lijevo)
2. Kliknite **API** tab
3. Kopirajte sljedeće:
   - **URL** (Project URL)
   - **anon public** key
   - **service_role** key (kliknite "Reveal" da vidite)

---

### 2️⃣ Konfigurirajte Environment Varijable

Napravite ili uredite `.env` fajl u root direktoriju projekta:

```env
# Supabase - ZAMIJENITE SA VAŠIM VRIJEDNOSTIMA!
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...

# Admin lozinka - PROMIJENITE!
ADMIN_PASSWORD=vasa_sigurna_lozinka

# Resend API (ako imate)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**⚠️ VAŽNO:**
- Zamijenite `PUBLIC_SUPABASE_URL` sa URL-om iz Supabase
- Zamijenite `PUBLIC_SUPABASE_ANON_KEY` sa anon key-em
- Zamijenite `SUPABASE_SERVICE_ROLE_KEY` sa service role key-em
- Promijenite `ADMIN_PASSWORD` u nešto sigurno!

---

### 3️⃣ Pokrenite Development Server

```bash
npm run dev
```

Server će se pokrenuti na: `http://localhost:4321`

---

### 4️⃣ Napunite Proizvode u Supabase

**Dva načina:**

#### Način 1: Kroz Web Interface (Preporučeno)

1. Otvorite browser na: **http://localhost:4321/admin-tools**
2. Kliknite gumb **"Pokreni Seed"**
3. Pričekajte da se svi proizvodi napune (trebalo bi biti 5 proizvoda)
4. Vidjet ćete rezultat: ✅ Uspješno: 5 | Greške: 0

#### Način 2: Ručno kroz Admin Panel

1. Idite na: **http://localhost:4321/admin**
2. Unesite lozinku (iz `.env` fajla)
3. Kliknite **Proizvodi** → **+ Dodaj proizvod**
4. Popunite formu i spremite

---

### 5️⃣ Testirajte Sve Funkcionalnosti

#### ✅ Test 1: Admin Login
```
URL: http://localhost:4321/admin
Lozinka: (ona iz .env fajla)
Očekivano: Uspješna prijava i prikaz dashboarda
```

#### ✅ Test 2: Proizvodi u Admin Panelu
```
1. Admin → Proizvodi
2. Trebali biste vidjeti 5 proizvoda (ako ste napunili)
3. Kliknite "Uredi" na bilo kojem proizvodu
4. Promijenite cijenu
5. Spremi → Cijena se ažurira
```

#### ✅ Test 3: Nova Narudžba
```
1. Otvorite novi tab: http://localhost:4321/shop
2. Dodajte proizvod u košaricu
3. Idite na Checkout
4. Popunite formu i pošaljite narudžbu
5. Vratite se na Admin → Narudžbe
6. Trebali biste vidjeti NOVU narudžbu! ✅
```

#### ✅ Test 4: Upravljanje Narudžbom
```
1. Admin → Narudžbe
2. Kliknite "Detalji" na narudžbi
3. Promijenite status iz "Na čekanju" u "U obradi"
4. Status se odmah ažurira u tablici
```

#### ✅ Test 5: Postavke
```
1. Admin → Postavke
2. Promijenite "Cijena dostave" na 6.00€
3. Kliknite "Spremi postavke"
4. Idite na /shop → dodajte proizvod → checkout
5. Trošak dostave bi trebao biti 6.00€
```

---

## 🎉 GOTOVO!

Ako su svi testovi prošli, vaš admin panel je potpuno funkcionalan! 🚀

---

## 🐛 Česta Pitanja i Problemi

### ❓ "Failed to fetch products" u Admin panelu

**Rješenje:**
1. Provjerite da li su Supabase kredencijali ispravni u `.env`
2. Provjerite da li ste pokrenuli `supabase-schema.sql` skriptu
3. Otvorite Supabase dashboard → Table Editor → trebali biste vidjeti tablice: `products`, `orders`, `settings`

### ❓ "Neispravna lozinka" na login stranici

**Rješenje:**
- Provjerite `ADMIN_PASSWORD` u `.env` fajlu
- Obavezno restartujte development server nakon promjene `.env` fajla

### ❓ Proizvodi nisu u admin panelu nakon seed-a

**Rješenje:**
1. Idite na http://localhost:4321/admin-tools i pokrenite seed ponovno
2. Provjerite console za greške
3. Otvorite Supabase dashboard → Table Editor → `products` tablicu → trebali biste vidjeti proizvode

### ❓ Narudžbe se ne bilježe

**Rješenje:**
1. Otvorite browser Console (F12) tijekom checkout-a
2. Trebali biste vidjeti: "✅ Order successfully saved to Supabase"
3. Ako ne vidite, provjerite `SUPABASE_SERVICE_ROLE_KEY` u `.env`
4. Restart development servera

### ❓ "Insert violates row-level security policy"

**Rješenje:**
- To znači da SQL skripta nije pravilno pokrenuta
- Idite u Supabase SQL Editor i ponovno pokrenite `supabase-schema.sql`
- Tablice moraju imati RLS politike koje dopuštaju insert/update

---

## 📚 Dodatna Dokumentacija

- **`QUICK_START.md`** - Originalni brzi vodič
- **`ADMIN_SETUP.md`** - Detaljna tehnička dokumentacija
- **`FEATURES.md`** - Lista svih funkcionalnosti
- **`SUMMARY.md`** - Pregled cijelog projekta

---

## 🚀 Sljedeći Koraci

Kada sve radi lokalno:

1. **Deploy na Vercel:**
   ```bash
   git add .
   git commit -m "Add admin panel with Supabase"
   git push
   ```

2. **Dodajte Environment Varijable na Vercel:**
   - Idite na Vercel Dashboard → Your Project → Settings → Environment Variables
   - Dodajte sve varijable iz `.env` fajla

3. **Napunite proizvode na produkciji:**
   - Nakon deploya, idite na: `https://vasa-domena.vercel.app/admin-tools`
   - Kliknite "Pokreni Seed"

---

**Trebate pomoć?** Pogledajte detaljnu dokumentaciju ili provjerite Supabase/Astro docs.

**Sretno! 🌾✨**

