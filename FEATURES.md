# 🌾 Eko Leventić - Admin Panel Features

## 📋 Pregled Sustava

Kompletan e-commerce admin panel sa Supabase backend-om za upravljanje online trgovinom.

---

## 🎨 Dizajn i UX

### Responzivni Dizajn
- ✅ Potpuno responzivan admin panel
- ✅ Moderni Tailwind CSS styling
- ✅ Optimizirano za desktop i tablet uređaje
- ✅ Intuitivna navigacija

### Boje i Teme
- 🌿 Zelena tema koja odgovara eko brendu
- 🎯 Status badges sa jasnim vizualnim signalima
- ✨ Glatke animacije i prijelazi

---

## 🔐 Autentifikacija

### Jednostavna Lozinka
- Brza prijava sa password-based auth
- Session storage za zadržavanje prijave
- Automatska odjava na zatvoren browser
- Mogućnost nadogradnje na kompleksniji auth sistem

### Sigurnosne Značajke
- Environment varijabla za lozinku
- Server-side verifikacija
- Service role key samo na backend-u
- Row Level Security na Supabase-u

---

## 📦 Upravljanje Proizvodima

### CRUD Operacije
- ✅ **Create**: Dodavanje novih proizvoda kroz intuitivan modal
- ✅ **Read**: Pregled svih proizvoda u tablici
- ✅ **Update**: Brzo uređivanje postojećih proizvoda
- ✅ **Delete**: Sigurno brisanje sa potvrdom

### Podaci o Proizvodu
- Naziv i opis
- Cijena (osnovna i varijante)
- Emoji i slike
- Varijante težina (1kg, 5kg, 10kg)
- Detaljan opis
- Nutritivne informacije
- Sastojci i upotreba
- Rok trajanja i skladištenje

### Funkcionalnosti
- Real-time ažuriranje
- Validacija podataka
- Mogućnost dodavanja više slika
- Podrška za različite jedinice mjere

---

## 🛒 Upravljanje Narudžbama

### Pregled Narudžbi
- Tablica sa svim narudžbama
- Sortiranje po datumu (najnovije prvo)
- Filtriranje po statusu
- Brzi pregled ključnih informacija

### Statusi Narudžbi
1. **Na čekanju** 🟡 - Nova narudžba
2. **U obradi** 🔵 - Administrator radi na narudžbi
3. **Poslano** 🟣 - Paket je poslan
4. **Dostavljeno** 🟢 - Uspješna dostava
5. **Otkazano** 🔴 - Otkazana narudžba

### Detalji Narudžbe
- Potpune informacije o kupcu
- Lista naručenih proizvoda
- Količine i cijene
- Trošak dostave
- Ukupan iznos
- Napomene kupca

### Akcije
- Promjena statusa jednim klikom
- Pregled detalja u modalu
- Email notifikacije (ako je konfigurirano)

---

## ⚙️ Postavke Trgovine

### Troškovi Dostave
- **Osnovna cijena**: Default trošak dostave
- **Besplatna dostava**: Prag za free shipping
- Real-time preview promjena

Primjer:
```
Dostava: €5.00
Besplatna dostava od: €50.00
```

### Валuta
- EUR (€) - Default
- HRK (kn)
- USD ($)
- Lako proširivo za druge валute

### Porezi
- Konfigurabilna PDV stopa
- Automatski prikaz u postocima
- Spremanje u decimal formatu (0.25 = 25%)

### Dodatne Značajke
- Jednostavno spremanje svih postavki
- Success/error poruke
- Validacija podataka
- Revert mogućnost

---

## 🔧 Tehnički Stack

### Frontend
- **Astro**: Static site generator sa server-side rendering
- **React**: UI komponente
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

### Backend
- **Supabase**: PostgreSQL database
- **Row Level Security**: Database-level security
- **Real-time capabilities**: Instant updates (može se nadograditi)

### API Struktura
```
/api/admin/
├── verify-password      # Auth endpoint
├── products/
│   ├── index           # GET/POST
│   └── [id]            # PUT/DELETE
├── orders/
│   ├── index           # GET/POST
│   └── [id]            # PUT/DELETE
└── settings/
    └── index           # GET/PUT
```

---

## 📊 Supabase Baza Podataka

### Tablice

#### 1. `products`
```sql
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- price (DECIMAL)
- unit (TEXT)
- emoji (TEXT)
- image (TEXT)
- images (JSONB)
- variants (JSONB)
- detailed_description (TEXT)
- usage (TEXT)
- ingredients (TEXT)
- notes (TEXT)
- storage (TEXT)
- expiry (TEXT)
- nutrition (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. `orders`
```sql
- id (UUID, PRIMARY KEY)
- order_number (TEXT, UNIQUE)
- customer_name (TEXT)
- customer_email (TEXT)
- customer_phone (TEXT)
- customer_address (TEXT)
- customer_city (TEXT)
- customer_postal_code (TEXT)
- items (JSONB)
- subtotal (DECIMAL)
- shipping_cost (DECIMAL)
- total (DECIMAL)
- status (TEXT)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. `settings`
```sql
- id (UUID, PRIMARY KEY)
- key (TEXT, UNIQUE)
- value (JSONB)
- updated_at (TIMESTAMP)
```

### Indeksi
- `idx_orders_status` - Brže filtriranje po statusu
- `idx_orders_created_at` - Sortiranje po datumu
- `idx_orders_order_number` - Pretraživanje po broju narudžbe
- `idx_settings_key` - Brži pristup postavkama

### Triggeri
- Automatsko ažuriranje `updated_at` polja
- Funkcija `update_updated_at_column()`

---

## 🚀 Deployment

### Development
```bash
npm run dev
```
Admin panel: `http://localhost:4321/admin`

### Production (Vercel)
1. Push na GitHub
2. Connect na Vercel
3. Dodaj environment varijable
4. Deploy

Environment varijable za Vercel:
```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
RESEND_API_KEY=... (opciono)
```

---

## 📈 Buduće Nadogradnje (Prijedlozi)

### Autentifikacija
- [ ] Multi-user support
- [ ] Supabase Auth integracija
- [ ] Role-based access (admin, moderator, viewer)
- [ ] Forgot password funkcionalnost

### Dashboard
- [ ] Analytics i statistika
- [ ] Graphs za prodaju
- [ ] Top proizvodi
- [ ] Revenue tracking

### Proizvodi
- [ ] Bulk import/export (CSV)
- [ ] Categories/tags
- [ ] Stock management
- [ ] Image upload (ne samo URL)
- [ ] Product variations (boja, veličina)

### Narudžbe
- [ ] Search i advanced filters
- [ ] Export narudžbi (PDF/Excel)
- [ ] Bulk actions
- [ ] Email notifications automatski
- [ ] Print shipping labels
- [ ] Order tracking

### Kupci
- [ ] Customer management
- [ ] Order history po kupcu
- [ ] Customer notes
- [ ] Loyalty program

### Postavke
- [ ] Email templates editor
- [ ] Payment gateway settings
- [ ] Tax rules po regiji
- [ ] Discount codes/coupons

### UI/UX
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Drag & drop reordering
- [ ] Quick actions menu
- [ ] Breadcrumbs navigation

---

## 💡 Korisni Savjeti

### Performance
- Koristi indekse u Supabase-u za brže pretraživanje
- Paginiraj velike liste proizvoda/narudžbi
- Cache često korištene postavke

### Sigurnost
- **VAŽNO**: Promijeni `ADMIN_PASSWORD` prije produkcije
- Koristi jake lozinke za Supabase
- Ne dijeli `SERVICE_ROLE_KEY` s nikim
- Redovito pravi backup baze podataka

### Workflow
1. Dodaj proizvode kroz admin panel
2. Testiraj checkout proces
3. Provjeri da narudžbe dolaze u admin
4. Postavi realne troškove dostave
5. Testiraj sve statuse narudžbi

---

## 🎓 Resursi

- [Supabase Docs](https://supabase.com/docs)
- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Kreirao:** AI Asistent 🤖
**Verzija:** 1.0.0
**Datum:** Studeni 2025

Sretno sa vašom e-commerce trgovinom! 🌾✨

