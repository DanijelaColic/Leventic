# 🔧 Supabase Troubleshooting

## ❌ Greška: `ENOTFOUND dzpxgsessvwmgegzqvlu.supabase.co`

Ova greška znači da aplikacija ne može pronaći Supabase server. Evo kako to riješiti:

### 1️⃣ Provjerite `.env` fajl

Provjerite da li postoji `.env` fajl u root direktoriju projekta sa sljedećim varijablama:

```env
PUBLIC_SUPABASE_URL=https://vas-projekt.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2️⃣ Provjerite Supabase Dashboard

1. Idite na https://supabase.com/dashboard
2. Provjerite da li je vaš projekt aktivan
3. Ako projekt ne postoji ili je obrisan, kreirajte novi:
   - Kliknite "New Project"
   - Unesite ime projekta
   - Odaberite regiju
   - Pričekajte da se projekt kreira (1-2 minute)

### 3️⃣ Kopirajte ispravne kredencijale

1. U Supabase Dashboard → **Project Settings** (zupčanik ikona)
2. Kliknite na **API** tab
3. Kopirajte:
   - **Project URL** → `PUBLIC_SUPABASE_URL` u `.env`
   - **anon public** key → `PUBLIC_SUPABASE_ANON_KEY` u `.env`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` u `.env` (kliknite "Reveal")

### 4️⃣ Provjerite format URL-a

URL mora biti u formatu:
```
https://xxxxxxxxxxxxx.supabase.co
```

**NE:**
- `http://` (mora biti `https://`)
- `dzpxgsessvwmgegzqvlu.supabase.co` (bez `https://`)
- Prazan string

### 5️⃣ Restartajte development server

Nakon promjene `.env` fajla, **MORATE** restartati server:

```bash
# Zaustavite server (Ctrl+C)
# Zatim pokrenite ponovno:
npm run dev
```

### 6️⃣ Provjerite da li je SQL skripta pokrenuta

1. U Supabase Dashboard → **SQL Editor**
2. Provjerite da li postoje tablice: `products`, `orders`, `settings`
3. Ako ne postoje, pokrenite `supabase-schema.sql` skriptu

## ✅ Provjera da li radi

Nakon što ste ispravili konfiguraciju:

1. Restartajte server
2. Otvorite admin panel: `http://localhost:4321/admin`
3. Provjerite konzolu preglednika (F12) - ne bi trebalo biti grešaka
4. Provjerite terminal - ne bi trebalo biti `ENOTFOUND` grešaka

## 🆘 Još uvijek ne radi?

1. **Provjerite mrežnu konekciju** - možete li pristupiti https://supabase.com?
2. **Provjerite firewall** - možda blokira Supabase domene
3. **Provjerite DNS** - pokušajte `ping supabase.com` u terminalu
4. **Kreirajte novi Supabase projekt** - možda je stari projekt obrisan

## 📝 Primjer ispravnog `.env` fajla

```env
# Supabase - ZAMIJENITE SA VAŠIM VRIJEDNOSTIMA!
PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjkwLCJleHAiOjE5NTQ1NDMyOTB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Admin lozinka
ADMIN_PASSWORD=vasa_sigurna_lozinka
```

**⚠️ VAŽNO:** Nikada ne commitajte `.env` fajl u Git!

