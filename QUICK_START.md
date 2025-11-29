# 🚀 Brzi Start - Admin Panel

## 📝 Koraci za pokretanje (5 minuta)

### 1️⃣ Kreiraj Supabase Projekt

1. Idi na https://supabase.com i registriraj se
2. Klikni "New Project"
3. Popuni:
   - Project name: `eko-leventic`
   - Database password: (zapamti ovu lozinku!)
   - Region: Europe West
4. Klikni "Create new project" i pričekaj 1-2 minute

### 2️⃣ Pokreni SQL Skriptu

1. U Supabase dashboardu → **SQL Editor** (lijeva strana)
2. Otvori fajl `supabase-schema.sql` iz projekta
3. Kopiraj cijeli sadržaj
4. Zalijepi u SQL Editor
5. Klikni **RUN** (Ctrl+Enter)
6. Trebao bi vidjeti: ✅ "Success. No rows returned"

### 3️⃣ Kopiraj API Ključeve

1. U Supabase → **Project Settings** (ikona zupčanika dolje lijevo)
2. Idi na **API** tab
3. Kopiraj:
   - `URL` (Project URL)
   - `anon public` key
   - `service_role` key (klikni "Reveal")

### 4️⃣ Postavi Environment Varijable

Otvori `.env` fajl (ili kreiraj novi) i zamijenite vrijednosti:

```env
# Supabase - KOPIRAJ SA SUPABASE DASHBOARD
PUBLIC_SUPABASE_URL=https://tvoj-projekt.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Admin lozinka - PROMIJENI!
ADMIN_PASSWORD=tvoja_sigurna_lozinka
```

### 5️⃣ Napuni Proizvode (Opciono)

```bash
npm run seed:products
```

Ova skripta će automatski prenijeti sve proizvode iz `src/data/products.ts` u Supabase.

### 6️⃣ Pokreni Server

```bash
npm run dev
```

### 7️⃣ Otvori Admin Panel

Idi na: **http://localhost:4321/admin**

Unesi lozinku koju si postavio u `.env` fajlu.

---

## ✅ Gotovo!

Sada imaš potpuno funkcionalan admin panel sa:
- ✅ Upravljanje proizvodima (dodaj, uredi, obriši)
- ✅ Pregled i upravljanje narudžbama
- ✅ Postavke dostave i cijena

---

## 📚 Za više detalja

Pogledaj `ADMIN_SETUP.md` za detaljniju dokumentaciju i troubleshooting.

## 🎯 Testiranje

1. **Proizvodi**: Dodaj test proizvod i vidi ga odmah u tablici
2. **Narudžbe**: Napravi narudžbu na `/shop` i vidi je u admin panelu
3. **Postavke**: Promijeni cijenu dostave i vidi promjene na checkout stranici

---

**Napomena:** Za produkcijsko korištenje, ne zaboravi promijeniti `ADMIN_PASSWORD` u nešto jako sigurno! 🔐

