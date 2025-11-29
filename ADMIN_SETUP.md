# 🌾 Admin Panel Setup - Eko Leventić

## 📋 Pregled

Kompletan admin panel za upravljanje e-commerce stranicom sa Supabase bazom podataka.

## ✨ Funkcionalnosti

### 1. **Upravljanje Proizvodima** 📦
- Dodavanje novih proizvoda
- Uređivanje postojećih proizvoda
- Brisanje proizvoda
- Upravljanje varijantama (težine i cijene)
- Slike, detaljan opis, nutritivne informacije

### 2. **Upravljanje Narudžbama** 🛒
- Pregled svih narudžbi
- Filtriranje po statusu
- Ažuriranje statusa narudžbe (Na čekanju → U obradi → Poslano → Dostavljeno)
- Pregled detalja narudžbe i kupca
- Pregled stavki narudžbe

### 3. **Postavke Trgovine** ⚙️
- Troškovi dostave
- Prag za besplatnu dostavu
- Валuta
- PDV stopa

## 🚀 Postavljanje Supabase-a

### Korak 1: Kreiranje Supabase Projekta

1. Idite na [supabase.com](https://supabase.com)
2. Registrirajte se ili prijavite
3. Kliknite "New Project"
4. Unesite ime projekta (npr. "eko-leventic")
5. Odaberite lozinku za bazu podataka
6. Odaberite region (Europe West)
7. Kliknite "Create new project"

### Korak 2: Pokretanje SQL Skripte

1. U Supabase dashboardu, idite na **SQL Editor** (lijeva strana)
2. Kliknite "New query"
3. Kopirajte cijeli sadržaj iz fajla `supabase-schema.sql`
4. Zalijepite u SQL editor
5. Kliknite "Run" (ili Ctrl+Enter)
6. Trebali biste vidjeti poruku "Success. No rows returned"

### Korak 3: Verifikacija Tablica

1. Idite na **Table Editor** (lijeva strana)
2. Trebali biste vidjeti 3 tablice:
   - `products` - Proizvodi
   - `orders` - Narudžbe
   - `settings` - Postavke

### Korak 4: Dohvaćanje API Ključeva

1. Idite na **Project Settings** > **API** (ikona zupčanika dolje lijevo)
2. Kopirajte sljedeće vrijednosti:
   - **Project URL** (URL)
   - **anon public** key (ANON_KEY)
   - **service_role** key (SERVICE_ROLE_KEY) - **Važno:** Kliknite "Reveal" da vidite ključ

### Korak 5: Konfiguracija Environment Varijabli

Kreirajte `.env` fajl u root direktoriju projekta (ili uredite postojeći):

\`\`\`env
# Resend API (ako već imate)
RESEND_API_KEY=your_resend_api_key_here

# Supabase - ZAMIJENITE SA VAŠIM VRIJEDNOSTIMA
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin lozinka - PROMIJENITE OVO!
ADMIN_PASSWORD=vasa_sigurna_lozinka_ovdje
\`\`\`

**VAŽNO:** 
- Nikada ne commitajte `.env` fajl u Git!
- Promijenite `ADMIN_PASSWORD` u nešto sigurno
- Čuvajte `SERVICE_ROLE_KEY` kao strogo povjerljiv - on ima puni pristup bazi!

## 🎯 Testiranje Admin Panela

### 1. Pokretanje Development Servera

\`\`\`bash
npm run dev
\`\`\`

### 2. Pristup Admin Panelu

Otvorite browser i idite na:
\`\`\`
http://localhost:4321/admin
\`\`\`

### 3. Prijava

Unesite lozinku koju ste postavili u `.env` fajlu (`ADMIN_PASSWORD`)

### 4. Testiranje Proizvoda

1. Idite na **Proizvodi** stranicu
2. Kliknite **+ Dodaj proizvod**
3. Popunite formu:
   - Naziv: "Test Proizvod"
   - Opis: "Ovo je test proizvod"
   - Cijena: 10.00
   - Emoji: 🌾
   - URL slike: `/Bijelo_pirovo_brasno.jpg`
4. Kliknite **Spremi**
5. Proizvod bi se trebao pojaviti u tablici

**Test urediivanja:**
- Kliknite **Uredi** na proizvodu
- Promijenite cijenu na 12.00
- Kliknite **Spremi**
- Cijena bi se trebala ažurirati

**Test brisanja:**
- Kliknite **Obriši** na test proizvodu
- Potvrdite brisanje
- Proizvod bi trebao nestati iz tablice

### 5. Testiranje Narudžbi

**Kreiranje test narudžbe:**

1. Otvorite novi tab i idite na `http://localhost:4321/shop`
2. Dodajte neki proizvod u košaricu
3. Idite na checkout
4. Popunite formu i pošaljite narudžbu
5. Vratite se na admin panel (`/admin`)
6. Idite na **Narudžbe** stranicu
7. Trebali biste vidjeti novu narudžbu

**Test ažuriranja statusa:**
- Kliknite **Detalji** na narudžbi
- Promijenite status iz "Na čekanju" u "U obradi"
- Status bi se trebao odmah ažurirati u tablici

### 6. Testiranje Postavki

1. Idite na **Postavke** stranicu
2. Promijenite "Osnovna cijena dostave" na 6.00
3. Promijenite "Besplatna dostava od" na 60.00
4. Kliknite **Spremi postavke**
5. Trebali biste vidjeti poruku "Postavke su uspješno spremljene!"

**Verifikacija:**
- Idite na shop stranicu
- Dodajte proizvode u košaricu
- Idite na checkout
- Provjerite da li je trošak dostave 6.00€

## 📁 Struktura Fajlova

\`\`\`
src/
├── components/
│   └── admin/
│       ├── AdminAuth.tsx           # Login forma
│       ├── AdminDashboard.tsx      # Glavni dashboard
│       ├── AdminLayout.tsx         # Layout sa navigacijom
│       ├── ProductsManager.tsx     # Upravljanje proizvodima
│       ├── OrdersManager.tsx       # Upravljanje narudžbama
│       └── SettingsManager.tsx     # Postavke
├── lib/
│   └── supabase.ts                 # Supabase client i typovi
├── pages/
│   ├── admin.astro                 # Admin stranica
│   └── api/
│       └── admin/
│           ├── verify-password.ts  # Verifikacija lozinke
│           ├── products/
│           │   ├── index.ts        # GET/POST proizvodi
│           │   └── [id].ts         # PUT/DELETE proizvod
│           ├── orders/
│           │   ├── index.ts        # GET/POST narudžbe
│           │   └── [id].ts         # PUT/DELETE narudžba
│           └── settings/
│               └── index.ts        # GET/PUT postavke
└── env.d.ts                        # TypeScript definicije za env varijable

supabase-schema.sql                 # SQL skripta za kreiranje tablica
\`\`\`

## 🔐 Sigurnost

1. **Admin Lozinka**: Koristi se jednostavna lozinka za brzu autentifikaciju. Za produkciju, razmislite o pravom auth sistemu.

2. **Row Level Security (RLS)**: Supabase tablice imaju RLS politike koje dopuštaju:
   - Čitanje svima (za frontend)
   - Pisanje samo autentificiranim korisnicima (admin koristi service_role key)

3. **Service Role Key**: 
   - Koristi se samo na server-side API rutama
   - Nikada se ne šalje na frontend
   - Ima puni pristup bazi

4. **Environment Varijable**:
   - Nikada ne commitajte `.env` fajl
   - Koristite `.env.local` ili Vercel environment variables za produkciju

## 🚀 Deploy na Vercel

1. **Dodaj Environment Varijable u Vercel**:
   - Idite na Vercel Dashboard > Your Project > Settings > Environment Variables
   - Dodajte sve varijable iz `.env` fajla

2. **Deploy**:
   \`\`\`bash
   git add .
   git commit -m "Add admin panel"
   git push
   \`\`\`

3. **Pristup Admin Panelu**:
   \`\`\`
   https://vasa-domena.vercel.app/admin
   \`\`\`

## 🐛 Troubleshooting

### Problem: "Failed to fetch products"
**Rješenje:** Provjerite da li su Supabase kredencijali ispravno postavljeni u `.env` fajlu

### Problem: "Neispravna lozinka"
**Rješenje:** Provjerite `ADMIN_PASSWORD` u `.env` fajlu

### Problem: Tablice ne postoje
**Rješenje:** Pokrenite `supabase-schema.sql` skriptu u Supabase SQL Editoru

### Problem: Cannot insert/update data
**Rješenje:** Provjerite da li koristite `SUPABASE_SERVICE_ROLE_KEY` (ne anon key)

## 📞 Podrška

Za dodatna pitanja ili probleme, pogledajte:
- [Supabase Dokumentaciju](https://supabase.com/docs)
- [Astro Dokumentaciju](https://docs.astro.build)

---

**Napomena:** Admin panel je potpuno funkcionalan i spreman za korištenje. Sve što trebate je postaviti Supabase projekt i konfigurirati environment varijable! 🎉

