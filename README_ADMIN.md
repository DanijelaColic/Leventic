# 🌾 Eko Leventić - Kompletna Admin Dokumentacija

## 📦 Što je kreirano?

Potpuno funkcionalan **admin panel za e-commerce** sa Supabase backend-om i modernim React sučeljem.

---

## 📁 Novi Fajlovi

### Admin Komponente (`src/components/admin/`)
```
✅ AdminAuth.tsx           - Login stranica sa password autentifikacijom
✅ AdminDashboard.tsx      - Main dashboard sa navigacijom
✅ AdminLayout.tsx         - Layout wrapper sa sidebar-om
✅ ProductsManager.tsx     - CRUD za proizvode
✅ OrdersManager.tsx       - Upravljanje narudžbama
✅ SettingsManager.tsx     - Postavke trgovine
```

### API Endpoints (`src/pages/api/admin/`)
```
✅ verify-password.ts      - Autentifikacija
✅ products/index.ts       - GET/POST proizvodi
✅ products/[id].ts        - PUT/DELETE proizvod
✅ orders/index.ts         - GET/POST narudžbe
✅ orders/[id].ts          - PUT/DELETE narudžba
✅ settings/index.ts       - GET/PUT postavke
```

### Supabase Setup
```
✅ src/lib/supabase.ts     - Supabase client konfiguracija
✅ supabase-schema.sql     - SQL skripta za kreiranje tablica
✅ scripts/seed-products.ts - Skripta za punjenje proizvoda
```

### Stranice
```
✅ src/pages/admin.astro   - Admin panel stranica
✅ src/pages/api/products.ts - Public API za dohvat proizvoda
```

### Dokumentacija
```
✅ QUICK_START.md          - Brzi vodič za pokretanje (5 min)
✅ ADMIN_SETUP.md          - Detaljna setup dokumentacija
✅ FEATURES.md             - Lista svih funkcionalnosti
✅ README_ADMIN.md         - Ovaj fajl
```

### Konfiguracija
```
✅ .gitignore              - Git ignore rules (.env zaštita)
✅ package.json            - Dodani npm scripts
✅ src/env.d.ts            - TypeScript definicije za env varijable
```

---

## 🚀 Kako Pokrenuti (TL;DR)

### 1. Kreiraj Supabase Projekt
```
1. Idi na https://supabase.com
2. New Project → eko-leventic
3. SQL Editor → Kopiraj supabase-schema.sql → Run
4. Project Settings → API → Kopiraj URL i Keys
```

### 2. Postavi Environment
```bash
# Kopiraj u .env fajl
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=tvoja_lozinka
```

### 3. Napuni Proizvode (opciono)
```bash
npm run seed:products
```

### 4. Pokreni
```bash
npm run dev
```

### 5. Otvori Admin
```
http://localhost:4321/admin
```

---

## ✨ Funkcionalnosti

### 📦 Proizvodi
- ✅ Dodavanje novih proizvoda
- ✅ Uređivanje postojećih
- ✅ Brisanje proizvoda
- ✅ Upravljanje varijantama (1kg, 5kg, 10kg)
- ✅ Slike i detaljan opis
- ✅ Nutritivne informacije

### 🛒 Narudžbe
- ✅ Pregled svih narudžbi
- ✅ Filtriranje po statusu
- ✅ Promjena statusa (Na čekanju → U obradi → Poslano → Dostavljeno)
- ✅ Detaljan pregled narudžbe
- ✅ Informacije o kupcu
- ✅ Pregled stavki

### ⚙️ Postavke
- ✅ Troškovi dostave
- ✅ Prag za besplatnu dostavu
- ✅ Валuta
- ✅ PDV stopa

### 🔐 Sigurnost
- ✅ Password autentifikacija
- ✅ Session storage
- ✅ Server-side verifikacija
- ✅ Row Level Security na Supabase
- ✅ Service role samo na backend-u

---

## 🗄️ Baza Podataka (Supabase)

### Tablice

**products** - Proizvodi trgovine
```sql
id, name, description, price, unit, emoji, image, 
images[], variants[], detailed_description, usage,
ingredients, notes, storage, expiry, nutrition{},
created_at, updated_at
```

**orders** - Narudžbe kupaca
```sql
id, order_number, customer_*, items[], 
subtotal, shipping_cost, total, status, notes,
created_at, updated_at
```

**settings** - Postavke trgovine
```sql
id, key, value{}, updated_at
```

### Inicijalne Postavke
```json
{
  "shipping_cost": { "default": 5.00, "free_above": 50.00 },
  "currency": "EUR",
  "tax_rate": 0.25
}
```

---

## 🎯 Use Cases

### Dodavanje Proizvoda
1. Admin → Proizvodi → + Dodaj proizvod
2. Popuni formu (naziv, opis, cijena, slika...)
3. Spremi
4. Proizvod se odmah prikazuje u shopu

### Obrada Narudžbe
1. Kupac naruči na `/shop`
2. Admin → Narudžbe → Vidi novu narudžbu
3. Klikni "Detalji"
4. Promijeni status u "U obradi"
5. Pripremi paket
6. Promijeni status u "Poslano"
7. Nakon dostave → "Dostavljeno"

### Promjena Cijene Dostave
1. Admin → Postavke
2. Promijeni "Osnovna cijena dostave"
3. Spremi postavke
4. Nova cijena se odmah primjenjuje na checkout

---

## 📊 Workflow Dijagram

```
┌─────────────────┐
│  Kupac naruči   │
│   (Shop page)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API kreira     │
│   narudžbu u    │
│    Supabase     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Admin vidi     │
│  novu narudžbu  │
│  (Dashboard)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Admin ažurira  │
│     status      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Dostavljeno   │
│   ✅ Gotovo!    │
└─────────────────┘
```

---

## 🔧 Troubleshooting

### ❌ "Failed to fetch products"
**Uzrok:** Supabase kredencijali nisu postavljeni ili su netočni
**Rješenje:** Provjeri `.env` fajl i Supabase dashboard

### ❌ "Neispravna lozinka"
**Uzrok:** Lozinka u `.env` ne odgovara unesenoj
**Rješenje:** Provjeri `ADMIN_PASSWORD` u `.env`

### ❌ Tablice ne postoje
**Uzrok:** SQL skripta nije pokrenuta
**Rješenje:** Pokreni `supabase-schema.sql` u Supabase SQL Editor

### ❌ Cannot insert data
**Uzrok:** Koristi se `anon` key umjesto `service_role`
**Rješenje:** Provjeri da API koristi `SUPABASE_SERVICE_ROLE_KEY`

---

## 🌐 Deploy na Vercel

```bash
# 1. Dodaj environment varijable u Vercel dashboard
# 2. Push na GitHub
git add .
git commit -m "Add admin panel with Supabase"
git push

# 3. Vercel će automatski deploy-ati
# 4. Pristup: https://tvoja-domena.vercel.app/admin
```

**Važno:** Dodaj SVE environment varijable u Vercel:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `RESEND_API_KEY` (ako koristiš)

---

## 📝 NPM Scripts

```bash
npm run dev              # Development server
npm run build            # Build za produkciju
npm run preview          # Preview production build
npm run seed:products    # Napuni proizvode u Supabase
```

---

## 🎓 Dodatni Resursi

### Dokumentacija
- 📘 `QUICK_START.md` - 5-minutni vodič za početak
- 📗 `ADMIN_SETUP.md` - Detaljan setup i testiranje
- 📙 `FEATURES.md` - Sve funkcionalnosti i mogućnosti

### External Links
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [Astro Docs](https://docs.astro.build)

---

## 🔮 Buduće Nadogradnje

Prioriteti za nadogradnju:
1. **Image Upload** - Upload slika direktno u Supabase Storage
2. **Analytics** - Dashboard sa statistikom prodaje
3. **Multi-user** - Više admin korisnika sa različitim rolama
4. **Email Notifications** - Automatski emailovi za statusne promjene
5. **Inventory Management** - Praćenje zaliha
6. **Customer Management** - CRM funkcionalnosti

---

## 💰 Troškovi

### Supabase (Free tier)
- ✅ 500MB database storage
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Dovoljno za malu do srednju trgovinu

### Vercel (Hobby tier - Free)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth
- ✅ Automatic HTTPS
- ✅ Preview deployments

**Ukupno: €0/mjesec za start!** 🎉

---

## ✅ Checklist prije Go Live

- [ ] Postavi Supabase projekt
- [ ] Pokreni SQL skriptu
- [ ] Dodaj environment varijable
- [ ] Testaj dodavanje proizvoda
- [ ] Testaj kreiranje narudžbe
- [ ] Testaj promjenu statusa
- [ ] Testaj postavke dostave
- [ ] Promijeni `ADMIN_PASSWORD` u nešto sigurno
- [ ] Deploy na Vercel
- [ ] Dodaj env varijable na Vercel
- [ ] Testiraj produkcijsku verziju
- [ ] Napravi backup baze podataka

---

## 🎉 Zaključak

Sada imate **potpuno funkcionalan admin panel** sa:

✅ Modernim UI dizajnom  
✅ Real-time Supabase backend-om  
✅ Sigurnom autentifikacijom  
✅ CRUD operacijama za proizvode  
✅ Upravljanjem narudžbama  
✅ Konfigurabilnim postavkama  
✅ Spremno za produkciju  

**Sve što trebate je postaviti Supabase i pokrenuti!** 🚀

---

**Kontakt za podršku:**
- Provjerite dokumentaciju u `ADMIN_SETUP.md`
- Pregledajte `FEATURES.md` za detalje o funkcionalnostima
- Konzultirajte Supabase/Astro dokumentaciju

**Sretno sa vašom e-commerce trgovinom!** 🌾✨

