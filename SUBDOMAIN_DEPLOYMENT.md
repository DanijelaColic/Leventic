# 🌐 Postavljanje na Poddomenu - Vodič

## 📋 Pregled

**Cilj:** Postaviti novu Astro stranicu na poddomenu (npr. `new.eko-leventic.hr` ili `test.eko-leventic.hr`) za testiranje, dok stara WordPress stranica ostaje na `https://eko-leventic.hr/`.

---

## ✅ DOBRA VIJEST: Kod ne treba promjene!

Vaš kod već koristi `window.location.origin` za API pozive, što znači da će automatski raditi na bilo kojoj domeni/poddomeni. **Ne trebate mijenjati kod!**

---

## 🚀 Koraci za Postavljanje na Poddomenu

### 1. Odaberite Poddomenu

Preporučene opcije:
- `new.eko-leventic.hr` - za novu verziju
- `test.eko-leventic.hr` - za testiranje
- `beta.eko-leventic.hr` - za beta verziju
- `staging.eko-leventic.hr` - za staging okruženje

**Preporuka:** `new.eko-leventic.hr` ili `test.eko-leventic.hr`

---

### 2. Konfigurirajte DNS Zapis

#### A) Pronađite DNS Provider

Provjerite gdje je vaša domena `eko-leventic.hr` registrirana i gdje se upravlja DNS zapisima:
- Registrator domene (gdje ste kupili domenu)
- Hosting provider
- Cloudflare (ako koristite)

#### B) Dodajte CNAME Zapis

Dodajte novi DNS zapis za poddomenu:

**Tip zapisa:** `CNAME`  
**Ime/Host:** `new` (ili `test`, `beta`, itd.)  
**Vrijednost/Cilj:** `cname.vercel-dns.com`  
**TTL:** `3600` (ili Auto)

**Primjer:**
```
Tip: CNAME
Ime: new
Vrijednost: cname.vercel-dns.com
TTL: 3600
```

**Napomena:** Ako koristite Cloudflare, možete koristiti "Proxy" opciju (orange cloud) za dodatnu zaštitu.

---

### 3. Postavite Poddomenu u Vercel

#### A) Deploy Aplikacije

1. Pushajte kod na GitHub/GitLab (ako već nije)
2. Idite na [Vercel Dashboard](https://vercel.com/dashboard)
3. Importujte projekt (ako već nije importovan)
4. Kliknite na projekt

#### B) Dodajte Poddomenu

1. U Vercel Dashboard → Vaš projekt
2. **Settings** → **Domains**
3. Kliknite **"Add"** ili **"Add Domain"**
4. Unesite poddomenu: `new.eko-leventic.hr` (ili vašu odabranu)
5. Kliknite **"Add"**

#### C) Verificirajte DNS

Vercel će automatski provjeriti DNS zapis. Ako je sve ispravno, vidjet ćete:
- ✅ **Valid Configuration** - zelena ikona
- Status: **Valid**

Ako vidi grešku:
- Provjerite da li je DNS zapis propagirao (može potrajati nekoliko minuta do 24 sata)
- Provjerite da li je CNAME zapis ispravan

---

### 4. Environment Varijable u Vercel

**VAŽNO:** Postavite iste environment varijable kao što bi postavili za production:

1. Vercel Dashboard → Vaš projekt
2. **Settings** → **Environment Variables**
3. Dodajte sve varijable:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `ADMIN_PASSWORD`

4. **VAŽNO:** Provjerite da su postavljene za **"Production"** (ili sve okruženja)

---

### 5. Redeploy Aplikacije

Nakon postavljanja environment varijabli:

1. Vercel Dashboard → **Deployments**
2. Kliknite na najnoviji deployment
3. Kliknite **"Redeploy"** (ili napravite novi commit)

---

### 6. Provjerite da Radi

#### A) Provjerite Pristup

Otvorite u browseru:
- `https://new.eko-leventic.hr` (ili vašu poddomenu)

Trebali biste vidjeti novu Astro stranicu.

#### B) Testirajte Funkcionalnosti

1. **Shop stranica:**
   - [ ] Proizvodi se prikazuju
   - [ ] Košarica radi
   - [ ] Checkout radi

2. **Narudžbe:**
   - [ ] Napravite test narudžbu
   - [ ] Provjerite da li se email šalje
   - [ ] Provjerite da li se narudžba spremi u Supabase

3. **Admin Panel:**
   - [ ] Pristup: `https://new.eko-leventic.hr/admin`
   - [ ] Login radi
   - [ ] Proizvodi se prikazuju
   - [ ] Narudžbe se prikazuju

4. **Kontakt Forma:**
   - [ ] Forma se može poslati
   - [ ] Email stiže na `info@eko-leventic.hr`

---

## 📧 Email Konfiguracija

**VAŽNO:** Email adrese (`info@eko-leventic.hr`) će raditi i na poddomeni jer su to email adrese, ne URL-ovi.

Trenutno u kodu:
- ✅ Kontakt forma → `info@eko-leventic.hr`
- ✅ Obavijest o narudžbi → `info@eko-leventic.hr`
- ✅ Potvrda narudžbe → Email kupca

**Ne trebate mijenjati email adrese!**

---

## 🔄 Kasnije: Prebacivanje s Poddomene na Glavnu Domenu

Kada ste testirali i sve radi:

### Korak 1: Backup Stare Stranice

1. Provjerite da li imate backup WordPress stranice
2. Ako treba, eksportujte podatke iz WordPressa

### Korak 2: Dodajte Glavnu Domenu u Vercel

1. Vercel Dashboard → Vaš projekt
2. **Settings** → **Domains**
3. Dodajte: `eko-leventic.hr` (bez `www`)
4. Opciono: Dodajte i `www.eko-leventic.hr` (ako želite)

### Korak 3: Promijenite DNS za Glavnu Domenu

**Ako koristite CNAME:**
- Promijenite CNAME zapis za `eko-leventic.hr` na `cname.vercel-dns.com`

**Ako koristite A zapis:**
- Vercel će vam dati IP adrese koje trebate postaviti

### Korak 4: Provjerite da Radi

1. Pričekajte DNS propagaciju (nekoliko minuta do 24 sata)
2. Provjerite: `https://eko-leventic.hr`
3. Testirajte sve funkcionalnosti

### Korak 5: Uklonite Poddomenu (Opciono)

Ako više ne trebate poddomenu:
1. Vercel Dashboard → **Settings** → **Domains**
2. Kliknite na poddomenu
3. Kliknite **"Remove"**

---

## 🆘 Troubleshooting

### Problem: DNS ne propagira

**Rješenje:**
- Pričekajte do 24 sata (obično je brže)
- Provjerite DNS zapis koristeći [DNS Checker](https://dnschecker.org/)
- Provjerite da li je CNAME zapis ispravan

### Problem: "Invalid Configuration" u Vercel

**Rješenje:**
- Provjerite da li je DNS zapis ispravan
- Provjerite da li je CNAME postavljen na `cname.vercel-dns.com`
- Provjerite da li nema konflikta s drugim DNS zapisima

### Problem: SSL Certifikat ne radi

**Rješenje:**
- Vercel automatski postavlja SSL certifikat
- Pričekajte nekoliko minuta nakon dodavanja domene
- Provjerite da li je DNS zapis propagirao

### Problem: Stranica se ne učitava

**Rješenje:**
1. Provjerite Vercel logs: **Deployments** → **View Function Logs**
2. Provjerite da li je build uspješan
3. Provjerite environment varijable
4. Provjerite da li je aplikacija redeployana nakon postavljanja varijabli

---

## 📝 Checklist za Poddomenu

### Prije Deploya:
- [ ] Odabrana poddomena (npr. `new.eko-leventic.hr`)
- [ ] DNS CNAME zapis postavljen
- [ ] Poddomena dodana u Vercel
- [ ] Environment varijable postavljene u Vercel
- [ ] Aplikacija redeployana

### Nakon Deploya:
- [ ] Poddomena je dostupna (npr. `https://new.eko-leventic.hr`)
- [ ] Shop stranica radi
- [ ] Checkout radi
- [ ] Narudžbe se spremaju u Supabase
- [ ] Emailovi se šalju
- [ ] Admin panel radi
- [ ] Kontakt forma radi

---

## 🎯 Preporuke

1. **Koristite poddomenu za testiranje** - sigurno je testirati prije prebacivanja na glavnu domenu
2. **Testirajte sve funkcionalnosti** - provjerite da sve radi prije prebacivanja
3. **Backup stare stranice** - ako trebate vratiti WordPress
4. **Komunikacija s korisnicima** - obavijestite korisnike o promjeni (ako je potrebno)

---

## 📚 Dodatni Resursi

- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [DNS Propagation Checker](https://dnschecker.org/)
- [Vercel DNS Configuration](https://vercel.com/docs/concepts/projects/domains/add-a-domain)

---

**Napomena:** Sve upute iz `PRE_DEPLOYMENT_CHECKLIST.md` ostaju iste - samo dodajte korake za postavljanje poddomene!

