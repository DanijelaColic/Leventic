# 🔐 Sigurnost i Backup Strategija - Eko Leventić

## 📊 Trenutno Stanje Sigurnosti

### ✅ Što je dobro postavljeno:

1. **Environment Varijable**
   - ✅ `.env` fajl je u `.gitignore` (ne commitira se u Git)
   - ✅ API ključevi se čuvaju u Vercel environment varijablama
   - ✅ Service Role Key se koristi samo na server-side

2. **Supabase Sigurnost**
   - ✅ Row Level Security (RLS) je omogućen na svim tablicama
   - ✅ RLS politike ograničavaju pristup
   - ✅ Service Role Key se ne šalje na frontend

3. **Admin Autentifikacija**
   - ✅ Admin stranice imaju `noindex, nofollow` meta tag
   - ✅ Password se provjerava na server-side
   - ✅ Session storage se koristi za autentifikaciju

---

## ⚠️ Sigurnosni Problemi i Preporuke

### 1. Admin Autentifikacija (SREDNJI PRIORITET)

**Trenutno:**
- Password se šalje u plain text-u preko HTTPS
- Session storage se koristi (može biti ranjivo na XSS)
- Nema rate limiting na login endpointu

**Preporuke:**
- ✅ **Kratkoročno:** Koristite jaku lozinku (min. 16 znakova)
- ⚠️ **Srednjoročno:** Razmislite o implementaciji JWT tokena umjesto session storage
- ⚠️ **Dugoročno:** Razmislite o Supabase Auth integraciji

**Akcija:**
```bash
# Provjerite da li je ADMIN_PASSWORD jak:
# - Min. 16 znakova
# - Kombinacija velikih/malih slova, brojeva, simbola
# - Ne koristite jednostavne riječi
```

---

### 2. Rate Limiting (SREDNJI PRIORITET)

**Problem:**
- API endpointi nemaju rate limiting
- Moguće je napraviti brute force napad na admin login
- Kontakt forma može biti zloupotrebljena (spam)

**Preporuke:**
- ⚠️ **Kratkoročno:** Koristite Vercel Edge Functions sa rate limiting
- ⚠️ **Srednjoročno:** Implementirajte rate limiting u API endpointima
- ✅ **Dugoročno:** Razmislite o CAPTCHA za kontakt formu

**Akcija:**
- Provjerite Vercel usage limits
- Razmislite o dodavanju rate limiting middleware-a

---

### 3. CSRF Zaštita (NISKI PRIORITET)

**Problem:**
- Nema CSRF tokena na API endpointima
- Moguće je napraviti CSRF napad

**Preporuke:**
- ⚠️ **Srednjoročno:** Implementirajte CSRF token zaštitu
- ✅ **Kratkoročno:** Vercel automatski pruža neku zaštitu

---

### 4. Input Validacija (SREDNJI PRIORITET)

**Trenutno:**
- Email validacija postoji
- Nema sanitizacije inputa na server-side

**Preporuke:**
- ✅ **Kratkoročno:** Provjerite da li svi inputi imaju validaciju
- ⚠️ **Srednjoročno:** Dodajte sanitizaciju na server-side

---

### 5. HTTPS i SSL (AUTOMATSKI)

**Status:** ✅ Vercel automatski postavlja SSL certifikat

---

## 💾 Backup Strategija

### 🔴 KRITIČNO: Supabase Backup

**Zašto je važno:**
- Supabase sadrži sve vaše podatke (proizvodi, narudžbe, postavke)
- Gubitak podataka bi bio katastrofalan

**Kako postaviti:**

#### Automatski Backup (Preporučeno):
1. **Supabase Dashboard** → **Database** → **Backups**
2. Provjerite da li je **Point-in-Time Recovery** omogućen
3. Provjerite **Daily Backups** status

**Provjera:**
- Idite na: https://supabase.com/dashboard → Vaš projekt → **Database** → **Backups**
- Trebali biste vidjeti: ✅ "Daily backups enabled"

#### Ručni Backup (Preporučeno mjesečno):
1. **Supabase Dashboard** → **Database** → **Backups**
2. Kliknite **"Create Backup"**
3. Sačekajte da se backup kreira
4. Download backup fajl
5. Spremite na sigurno mjesto (cloud storage, external drive)

**Preporuka:** Napravite backup prije svake veće promjene!

---

### 🟡 VAŽNO: Environment Varijable Backup

**Zašto je važno:**
- Ako izgubite environment varijable, nećete moći pristupiti aplikaciji

**Kako napraviti backup:**

#### Lokalno (.env fajl):
```bash
# Kopirajte .env fajl na sigurno mjesto
cp .env .env.backup
```

**Gdje spremiti:**
- ✅ Password manager (1Password, LastPass, Bitwarden)
- ✅ Encrypted cloud storage (Google Drive sa enkripcijom, Dropbox)
- ✅ External drive (USB, external HDD)
- ❌ NE spremajte u Git!
- ❌ NE dijelite preko emaila!

#### Vercel Environment Varijable:
1. **Vercel Dashboard** → Vaš projekt → **Settings** → **Environment Variables**
2. Zapišite sve varijable u siguran dokument
3. Spremite u password manager

**Lista varijabli za backup:**
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_PASSWORD`

---

### 🟢 OPCIONALNO: Kod Backup

**Status:** ✅ Ako koristite Git, kod je već backup-ovan

**Preporuke:**
- ✅ Koristite Git (GitHub, GitLab, Bitbucket)
- ✅ Napravite regularne commit-e
- ✅ Pushajte na remote repository

---

## 📋 Backup Checklist

### Mjesečno:
- [ ] Supabase ručni backup (download)
- [ ] Provjera automatskih backup-a
- [ ] Backup environment varijabli (u password manager)

### Prije većih promjena:
- [ ] Supabase backup
- [ ] Environment varijable backup
- [ ] Git commit i push

### Tjedno:
- [ ] Provjera da li automatski backup radi
- [ ] Provjera Vercel deployment statusa

---

## 🚨 Što Učiniti Ako Se Nešto Dogodi

### Scenario 1: Gubitak Supabase Podataka

**Akcija:**
1. Idite na Supabase Dashboard → **Database** → **Backups**
2. Pronađite najnoviji backup
3. Kliknite **"Restore"**
4. Odaberite točku u vremenu za restore

**Prevencija:**
- Provjerite da li su automatski backup-i omogućeni
- Napravite ručni backup prije većih promjena

---

### Scenario 2: Gubitak Environment Varijabli

**Akcija:**
1. Provjerite password manager (gdje ste spremili backup)
2. Ako nemate backup:
   - Supabase: Idite na Dashboard → **Project Settings** → **API** (kopirajte ključeve)
   - Resend: Idite na Dashboard → **API Keys** (kopirajte ključ)
   - Admin Password: Morate postaviti novu (stara je izgubljena)

**Prevencija:**
- Spremite sve environment varijable u password manager
- Napravite backup dokument

---

### Scenario 3: Kompromitirana Lozinka

**Akcija:**
1. **ODMAH** promijenite `ADMIN_PASSWORD` u Vercel
2. Redeploy aplikaciju
3. Provjerite Supabase logs za sumnjive aktivnosti
4. Provjerite da li su podaci promijenjeni

**Prevencija:**
- Koristite jaku lozinku
- Ne dijelite lozinku
- Redovito mijenjajte lozinku (svakih 3-6 mjeseci)

---

## 🔒 Sigurnosne Preporuke - Akcijski Plan

### Prioritet 1 (KRITIČNO - Prije live):
1. ✅ **Provjerite Supabase Backup**
   - Idite na Supabase Dashboard → Database → Backups
   - Provjerite da li su automatski backup-i omogućeni

2. ✅ **Backup Environment Varijable**
   - Zapišite sve varijable u password manager
   - Spremite `.env` fajl na sigurno mjesto

3. ✅ **Jak Admin Password**
   - Provjerite da li je `ADMIN_PASSWORD` jak (min. 16 znakova)
   - Promijenite ako nije

### Prioritet 2 (VAŽNO - Nakon live):
4. ⚠️ **Rate Limiting**
   - Razmislite o dodavanju rate limiting-a na API endpointima
   - Provjerite Vercel usage limits

5. ⚠️ **Monitoring**
   - Postavite Supabase alerts za neobične aktivnosti
   - Provjerite Vercel logs redovito

### Prioritet 3 (OPCIONALNO):
6. ⚠️ **Poboljšanje Autentifikacije**
   - Razmislite o JWT tokenima umjesto session storage
   - Razmislite o Supabase Auth integraciji

7. ⚠️ **CSRF Zaštita**
   - Implementirajte CSRF token zaštitu

---

## 📝 Sigurnosni Checklist

### Prije Live Deploya:
- [ ] Supabase automatski backup omogućen
- [ ] Environment varijable spremljene u password manager
- [ ] `.env` fajl backup-ovan na sigurno mjesto
- [ ] `ADMIN_PASSWORD` je jak (min. 16 znakova)
- [ ] Provjerena Supabase RLS politike
- [ ] Provjerene Vercel environment varijable

### Nakon Live Deploya:
- [ ] Postavljen monitoring (Supabase alerts)
- [ ] Redoviti backup provjeri (tjedno)
- [ ] Plan za rate limiting (ako je potrebno)

---

## 🆘 Kontakt za Sigurnosne Incidente

Ako primijetite sigurnosni problem:
1. **ODMAH** promijenite kompromitirane lozinke
2. Provjerite Supabase logs
3. Provjerite Vercel logs
4. Kontaktirajte podršku ako je potrebno

---

## 📚 Dodatni Resursi

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Vercel Security](https://vercel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Datum zadnje provjere:** _______________
**Status:** ⬜ Sve provjereno / ⬜ Potrebne akcije

