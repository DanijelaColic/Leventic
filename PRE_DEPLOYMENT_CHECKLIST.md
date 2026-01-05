# ✅ Pre-Deployment Checklist - Eko Leventić

## 🚨 KRITIČNO - Prije postavljanja live

### 1. Environment Varijable u Vercel

Provjerite da su sve environment varijable postavljene u Vercel Dashboard:

#### Obavezno postaviti:
- ✅ `PUBLIC_SUPABASE_URL` - Supabase Project URL (https://xxx.supabase.co)
- ✅ `PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key
- ✅ `RESEND_API_KEY` - Resend API Key za slanje emailova
- ✅ `ADMIN_PASSWORD` - Sigurna admin lozinka (promijenite iz default!)

#### Kako postaviti u Vercel:
1. Idite na Vercel Dashboard → Vaš projekt
2. Settings → Environment Variables
3. Dodajte sve varijable (za Production, Preview i Development)
4. **VAŽNO:** Nakon dodavanja, redeployajte aplikaciju!

---

### 2. Email Konfiguracija (Resend)

#### ⚠️ TRENUTNO: Koristi se test domain `onboarding@resend.dev`

**Trebate promijeniti na production domain:**

1. **Verificirajte domenu u Resend:**
   - Idite na https://resend.com/domains
   - Dodajte `eko-leventic.hr` (ili vašu domenu)
   - Verificirajte DNS zapise (SPF, DKIM, DMARC)

2. **Ažurirajte "from" adrese u kodu:**
   - `src/pages/api/send-order-confirmation.ts` (linija 36, 50)
   - `src/pages/api/send-contact-form.ts` (linija 70)
   - Promijenite `onboarding@resend.dev` → `noreply@eko-leventic.hr` (ili vašu email adresu)

3. **Testirajte slanje emailova:**
   - Napravite test narudžbu
   - Provjerite da li email stiže na `info@eko-leventic.hr`
   - Provjerite da li kupac dobiva potvrdu

---

### 3. Supabase Konfiguracija

#### Provjerite:
- ✅ Supabase projekt je aktivan
- ✅ SQL skripta (`supabase-schema.sql`) je pokrenuta
- ✅ Tablice postoje: `products`, `orders`, `settings`
- ✅ Row Level Security (RLS) je omogućen
- ✅ Proizvodi su dodani u bazu (koristite `/admin-tools` ili admin panel)

#### Testiranje:
```bash
# Provjerite environment varijable
npm run check:env
```

---

### 4. Security Provjere

#### Admin Lozinka:
- ✅ `ADMIN_PASSWORD` je promijenjen iz default vrijednosti
- ✅ Lozinka je sigurna (min. 12 znakova, kombinacija slova, brojeva, simbola)
- ✅ Lozinka je postavljena u Vercel environment varijablama

#### API Keys:
- ✅ `SUPABASE_SERVICE_ROLE_KEY` je postavljen samo u Vercel (NE u frontend kodu)
- ✅ `RESEND_API_KEY` je postavljen samo u Vercel
- ✅ Nikada ne commitajte `.env` fajl u Git!

---

### 5. Email Adrese - Finalna Provjera

Provjerite da li su sve email adrese ispravne:

#### Potvrda narudžbe:
- ✅ Ide na: `order.customer.email` (email kupca)
- ✅ Subject: `Potvrda narudžbe #${order.id} - Eko Leventić`

#### Obavijest o novoj narudžbi:
- ✅ Ide na: `info@eko-leventic.hr`
- ✅ Subject: `Nova narudžba #${order.id} - Eko Leventić`

#### Kontakt forma:
- ✅ Ide na: `info@eko-leventic.hr`
- ✅ `replyTo`: Email korisnika koji je poslao poruku

---

### 6. Funkcionalnosti - Testiranje

#### Test 1: Shop stranica
- [ ] Proizvodi se prikazuju
- [ ] Košarica radi (dodavanje, uklanjanje, ažuriranje količine)
- [ ] Checkout forma radi
- [ ] Validacija formi radi

#### Test 2: Narudžbe
- [ ] Narudžba se kreira nakon checkouta
- [ ] Email potvrda se šalje kupcu
- [ ] Email obavijest se šalje na `info@eko-leventic.hr`
- [ ] Narudžba se prikazuje u admin panelu

#### Test 3: Admin Panel
- [ ] Login radi s `ADMIN_PASSWORD`
- [ ] Proizvodi se mogu dodati/urediti/obrisati
- [ ] Narudžbe se prikazuju i mogu se ažurirati
- [ ] Status narudžbe se može promijeniti
- [ ] Postavke se mogu spremiti

#### Test 4: Kontakt Forma
- [ ] Forma se može poslati
- [ ] Email stiže na `info@eko-leventic.hr`
- [ ] `replyTo` je postavljen na email korisnika

---

### 7. Production Build

#### Provjerite build:
```bash
# Lokalno testiranje production builda
npm run build
npm run preview
```

Provjerite:
- [ ] Build prođe bez grešaka
- [ ] Sve stranice se učitavaju
- [ ] API endpointi rade
- [ ] Nema console grešaka u browseru

---

### 8. Console Logs i Debugging

#### Provjerite da li ima previše console.log poruka:
- [ ] Uklonite ili komentirajte debug console.log poruke
- [ ] Zadržite samo kritične error logove

**Fajlovi za provjeru:**
- `src/pages/api/send-contact-form.ts` - ima dosta console.log
- `src/pages/api/send-order-confirmation.ts` - provjerite
- `src/components/CheckoutForm.tsx` - provjerite

---

### 9. Error Handling

Provjerite da li su sve greške pravilno obrađene:
- [ ] API endpointi vraćaju ispravne error poruke
- [ ] Frontend prikazuje korisničke error poruke
- [ ] Email slanje ne pada ako API ne radi (graceful degradation)

---

### 10. Performance

#### Provjerite:
- [ ] Slike su optimizirane
- [ ] Build size je razuman
- [ ] API pozivi su optimizirani
- [ ] Nema nepotrebnih dependency-ja

---

### 11. DNS i Domain

Ako koristite vlastitu domenu:
- [ ] DNS zapisi su postavljeni
- [ ] SSL certifikat je aktivan (Vercel automatski)
- [ ] Domain je povezan u Vercel Dashboard

---

### 12. Backup i Monitoring

#### Preporuke:
- [ ] Postavite Supabase backup (automatski u Supabase)
- [ ] Postavite Vercel monitoring/alerts
- [ ] Provjerite Resend usage limits
- [ ] Postavite Supabase usage alerts

---

## 📋 Finalni Koraci

### Prije deploya:
1. ✅ Sve environment varijable su postavljene u Vercel
2. ✅ Email "from" adrese su promijenjene s test domaina
3. ✅ `ADMIN_PASSWORD` je siguran
4. ✅ Build prođe bez grešaka
5. ✅ Sve funkcionalnosti su testirane

### Nakon deploya:
1. ✅ Testirajte live verziju
2. ✅ Provjerite da emailovi stižu
3. ✅ Provjerite admin panel
4. ✅ Napravite test narudžbu
5. ✅ Provjerite Supabase da se podaci spremaju

---

## 🆘 Troubleshooting

Ako nešto ne radi nakon deploya:

1. **Provjerite Vercel logs:**
   - Vercel Dashboard → Deployments → View Function Logs

2. **Provjerite environment varijable:**
   - Vercel Dashboard → Settings → Environment Variables
   - Provjerite da su postavljene za "Production"

3. **Provjerite Supabase:**
   - Supabase Dashboard → Logs
   - Provjerite da li se API pozivi vide

4. **Provjerite Resend:**
   - Resend Dashboard → Logs
   - Provjerite da li se emailovi šalju

---

## 📝 Notes

- **Email domain:** Trenutno koristi `onboarding@resend.dev` - **PROMIJENITI!**
- **Test email:** Uklonjen `dgaric1@gmail.com` - ✅ Gotovo
- **Admin email:** `info@eko-leventic.hr` - ✅ Postavljeno

---

**Datum provjere:** _______________
**Provjerio:** _______________
**Status:** ⬜ Spreman za deploy / ⬜ Potrebne izmjene

