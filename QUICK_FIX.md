# 🚨 BRZO RJEŠAVANJE: ENOTFOUND greška

## Problem
Greška: `ENOTFOUND dzpxgsessvwmgegzqvlu.supabase.co`

Ovo znači da Supabase URL u vašem `.env` fajlu **ne postoji** ili je projekt **obrisan**.

## ✅ Rješenje u 3 koraka

### Korak 1: Provjerite Supabase Dashboard

1. Idite na: https://supabase.com/dashboard
2. Provjerite da li vidite projekt sa URL-om `dzpxgsessvwmgegzqvlu.supabase.co`
3. **Ako NE VIDITE projekt:**
   - Projekt je obrisan ili ne postoji
   - **Kreirajte novi projekt** (vidi Korak 2)

### Korak 2: Kreirajte novi Supabase projekt (ako ne postoji)

1. U Supabase Dashboard kliknite **"New Project"**
2. Unesite:
   - **Project name:** `eko-leventic` (ili bilo koje ime)
   - **Database password:** (zapamtite ovu lozinku!)
   - **Region:** Europe West (ili najbliža vama)
3. Kliknite **"Create new project"**
4. Pričekajte 1-2 minute dok se projekt kreira

### Korak 3: Kopirajte nove kredencijale

1. U Supabase Dashboard → **Project Settings** (zupčanik ikona dolje lijevo)
2. Kliknite na **API** tab
3. Kopirajte sljedeće vrijednosti:

#### a) Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
Kopirajte u `.env` fajl kao:
```env
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
```

#### b) anon public key
Kliknite na "Copy" pored "anon public" key-a i kopirajte u `.env`:
```env
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### c) service_role key
1. Kliknite na **"Reveal"** pored "service_role" key-a
2. Kopirajte vrijednost u `.env`:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Korak 4: Pokrenite SQL skriptu

1. U Supabase Dashboard → **SQL Editor** (lijevi meni)
2. Kliknite **"New query"**
3. Otvorite fajl `supabase-schema.sql` iz projekta
4. Kopirajte **CIJELI** sadržaj
5. Zalijepite u SQL Editor
6. Kliknite **RUN** (ili Ctrl+Enter)
7. Trebali biste vidjeti: ✅ "Success. No rows returned"

### Korak 5: Restartajte server

```bash
# Zaustavite server (Ctrl+C u terminalu)
# Zatim pokrenite ponovno:
npm run dev
```

### Korak 6: Provjerite da li radi

1. Otvorite: http://localhost:4321/admin
2. Provjerite konzolu preglednika (F12) - ne bi trebalo biti grešaka
3. Provjerite terminal - ne bi trebalo biti `ENOTFOUND` grešaka

## 🔍 Provjera konfiguracije

Pokrenite provjeru:
```bash
npm run check:env
```

Ova skripta će provjeriti da li su sve varijable ispravno postavljene.

## 📝 Primjer ispravnog `.env` fajla

```env
# Supabase - ZAMIJENITE SA VAŠIM VRIJEDNOSTIMA!
PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjkwLCJleHAiOjE5NTQ1NDMyOTB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Admin lozinka
ADMIN_PASSWORD=vasa_sigurna_lozinka
```

**⚠️ VAŽNO:**
- URL mora počinjati sa `https://`
- URL mora završavati sa `.supabase.co`
- Nikada ne commitajte `.env` fajl u Git!

## 🆘 Još uvijek ne radi?

1. **Provjerite da li ste restartali server** - promjene u `.env` zahtijevaju restart!
2. **Provjerite format URL-a** - mora biti `https://xxx.supabase.co` (ne `http://`)
3. **Provjerite da li je projekt aktivan** u Supabase Dashboard
4. **Provjerite mrežnu konekciju** - možete li pristupiti https://supabase.com?

## 📚 Više pomoći

- `SUPABASE_TROUBLESHOOTING.md` - Detaljni troubleshooting vodič
- `QUICK_START.md` - Brzi start vodič
- `ADMIN_SETUP.md` - Detaljna setup dokumentacija

