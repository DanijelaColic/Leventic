# 🚀 Prebacivanje s Poddomene na Glavnu Domenu - Vodič

Ovaj vodič će vam pomoći da prebacite novi web sa poddomene (npr. `new.eko-leventic.hr`) na glavnu domenu (`eko-leventic.hr`).

---

## ✅ Preduvjeti - Provjerite Prije Početka

Prije nego što počnete, provjerite da imate:

- [x] ✅ **Backup WordPress fajlova** (već napravljeno)
- [x] ✅ **Backup WordPress baze podataka** (već napravljeno)
- [x] ✅ **Novi web testiran na poddomeni** (sve funkcionalnosti rade)
- [ ] Pristup DNS upravljanju (gdje se upravlja DNS zapisima)
- [ ] Pristup Vercel Dashboard-u

---

## 📋 Korak-po-Korak Vodič

### Korak 1: Finalna Provjera na Poddomeni

Prije prebacivanja, provjerite da sve radi na poddomeni:

#### A) Funkcionalnosti

- [ ] Shop stranica radi
- [ ] Proizvodi se prikazuju
- [ ] Košarica radi
- [ ] Checkout proces radi
- [ ] Narudžbe se spremaju u Supabase
- [ ] Emailovi se šalju (kontakt forma, narudžbe)
- [ ] Admin panel radi (`/admin`)
- [ ] Sve stranice se učitavaju ispravno

#### B) Test Narudžba

1. Napravite test narudžbu na poddomeni
2. Provjerite da li se email šalje
3. Provjerite da li se narudžba spremi u Supabase
4. Provjerite admin panel - da li se narudžba prikazuje

**Ako sve radi → Nastavite s Korakom 2**

---

### Korak 2: Dodajte Glavnu Domenu u Vercel

#### A) Pristup Vercel Dashboard

1. Otvorite: https://vercel.com/dashboard
2. Prijavite se u svoj account
3. Kliknite na vaš projekt

#### B) Dodajte Domenu

1. U Vercel Dashboard → Vaš projekt
2. Kliknite na **"Settings"** tab
3. Kliknite na **"Domains"** u lijevom sidebaru
4. Kliknite **"Add"** ili **"Add Domain"** gumb
5. Unesite glavnu domenu: `eko-leventic.hr` (bez `www` ili `https://`)
6. Kliknite **"Add"**

**Napomena:** Ne dodavajte `www.eko-leventic.hr` još - prvo dodajte glavnu domenu bez `www`.

#### C) Provjerite DNS Instrukcije

Vercel će vam pokazati instrukcije za DNS konfiguraciju. **Ne mijenjajte DNS još!**

Vercel će vam pokazati jednu od sljedećih opcija:

**Opcija 1: CNAME (Preporučeno)**
```
Tip: CNAME
Ime: @ (ili eko-leventic.hr)
Vrijednost: cname.vercel-dns.com
```

**Opcija 2: A Records**
```
Tip: A
Ime: @ (ili eko-leventic.hr)
Vrijednost: (Vercel će dati IP adrese - obično 2-4 IP adrese)
```

**Zapišite ove instrukcije - trebat će vam u sljedećem koraku!**

---

### Korak 3: Pronađite DNS Provider

Trebate znati gdje se upravlja DNS zapisima za `eko-leventic.hr`:

#### Moguće Lokacije:

1. **Registrator domene** (gdje ste kupili domenu)
   - Primjeri: Namecheap, GoDaddy, Google Domains, itd.

2. **Hosting provider** (gdje je WordPress hostiran)
   - Primjeri: cPanel, Plesk, itd.

3. **Cloudflare** (ako koristite Cloudflare DNS)

4. **Drugi DNS provider**

#### Kako Pronaći:

- Provjerite email od registratora domene
- Provjerite hosting kontrolni panel
- Provjerite Cloudflare dashboard (ako koristite)

---

### 📋 Specifične Upute za cPanel

Ako koristite **cPanel** za upravljanje DNS-om:

#### A) Pristup Zone Editor u cPanel-u

1. Prijavite se u cPanel
2. Pronađite sekciju **"Domains"** ili **"DNS"**
3. Kliknite na **"Zone Editor"** ili **"Advanced DNS Zone Editor"**
4. Odaberite domenu: `eko-leventic.hr`

#### B) Pronađite Trenutne A Records

U Zone Editor-u, pronađite postojeće **A Records** za `eko-leventic.hr`:
- Obično imaju **Name:** `@` ili `eko-leventic.hr`
- **Type:** `A`
- **Address:** IP adresa WordPress hostinga

#### C) Promijenite A Records

**Ako Vercel daje A Records (IP adrese):**

1. Pronađite postojeći A zapis s **Name:** `@` (ili `eko-leventic.hr`)
2. Kliknite na **"Edit"** ili **"Change"**
3. Promijenite **Address** (IP adresu) na prvu IP adresu koju je Vercel dao
4. Sačuvajte promjene
5. Ako Vercel daje više IP adresa, dodajte nove A zapise:
   - Kliknite **"Add Record"** ili **"+ A Record"**
   - **Name:** `@` (ili `eko-leventic.hr`)
   - **Type:** `A`
   - **Address:** (druga IP adresa od Vercel-a)
   - **TTL:** `3600` (ili ostavite default)
   - Ponovite za sve IP adrese koje je Vercel dao

**Ako Vercel daje Nameservers (ns1 i ns2):**

**VAŽNO:** Nameservers se obično mijenjaju kod registratora domene, ne u cPanel-u.

1. Provjerite u cPanel-u da li postoji opcija za promjenu nameservers
2. Ako ne postoji, idite kod registratora domene (gdje ste kupili domenu)
3. Promijenite nameservers na:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

#### D) Sačuvajte Promjene

1. Kliknite **"Save"** ili **"Save Zone File"**
2. Provjerite da li su promjene sačuvane
3. DNS promjene će se propagirati (može potrajati nekoliko minuta do 24 sata)

---

### Korak 4: Promijenite DNS Zapis za Glavnu Domenu

**VAŽNO:** Ovo će preusmjeriti glavnu domenu s WordPress weba na novi Vercel web.

#### A) Pristup DNS Upravljanju

1. Prijavite se u DNS provider (gdje se upravlja DNS zapisima)
2. Pronađite DNS zapise za `eko-leventic.hr`

#### B) Pronađite Trenutni DNS Zapis

Trebate pronaći trenutni DNS zapis koji pokazuje na WordPress hosting:

**Mogući zapisi:**
- **A Record** - pokazuje na IP adresu WordPress hostinga
- **CNAME** - pokazuje na hosting provider
- **Nameservers** - ako koristite hosting provider nameservers

**Primjer trenutnog zapisa:**
```
Tip: A
Ime: @
Vrijednost: 123.45.67.89 (IP adresa WordPress hostinga)
```

#### C) Promijenite DNS Zapis

**Ako Vercel traži CNAME:**

1. Pronađite postojeći A zapis ili CNAME zapis za `eko-leventic.hr`
2. **Ili promijenite postojeći zapis, ili dodajte novi:**
   - **Tip:** `CNAME`
   - **Ime/Host:** `@` (ili `eko-leventic.hr` - ovisno o provideru)
   - **Vrijednost/Cilj:** `cname.vercel-dns.com`
   - **TTL:** `3600` (ili Auto)

**Ako Vercel traži A Records:**

1. Pronađite postojeći A zapis za `eko-leventic.hr`
2. Promijenite IP adresu na IP adrese koje je Vercel dao
3. **Ili dodajte nove A zapise:**
   - **Tip:** `A`
   - **Ime/Host:** `@` (ili `eko-leventic.hr`)
   - **Vrijednost:** (IP adresa koju je Vercel dao - dodajte sve IP adrese)
   - **TTL:** `3600` (ili Auto)

**Ako Vercel traži Nameservers (ns1 i ns2):**

**VAŽNO:** Nameservers se obično mijenjaju kod registratora domene (gdje ste kupili domenu), ne u cPanel-u direktno. Ali možete provjeriti u cPanel-u.

**Opcija 1: Promjena Nameservers u cPanel-u (ako je moguće):**

1. U cPanel-u, idite na **"Zone Editor"** ili **"Advanced DNS Zone Editor"**
2. Provjerite da li postoji opcija za promjenu nameservers
3. Ako postoji, promijenite na:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

**Opcija 2: Promjena Nameservers kod Registratora Domene (Preporučeno):**

1. Prijavite se kod registratora domene (gdje ste kupili `eko-leventic.hr`)
2. Pronađite sekciju **"Nameservers"** ili **"DNS Management"**
3. Promijenite nameservers na:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. Sačuvajte promjene

**Napomena:** Ako koristite cPanel nameservers, promjena na Vercel nameservers će prekinuti vezu s cPanel hostingom. To je u redu ako želite prebaciti web na Vercel.

**Napomena:** Neki DNS provideri ne dozvoljavaju CNAME za root domenu (`@`). U tom slučaju, koristite A Records koje Vercel daje.

#### D) Sačuvajte Promjene

1. Kliknite **"Save"** ili **"Update"**
2. DNS promjene će se propagirati (može potrajati nekoliko minuta do 24 sata)

---

### Korak 5: Provjerite DNS Propagaciju

#### A) Provjerite u Vercel Dashboard

1. Vercel Dashboard → Vaš projekt → **Settings** → **Domains**
2. Provjerite status domene `eko-leventic.hr`
3. Trebali biste vidjeti:
   - ✅ **Valid Configuration** - zelena ikona
   - Status: **Valid**

**Ako vidite grešku:**
- Pričekajte nekoliko minuta (DNS propagacija može potrajati)
- Provjerite da li je DNS zapis ispravan
- Provjerite da li je DNS zapis sačuvan

#### B) Provjerite DNS Propagaciju Online

1. Otvorite: https://dnschecker.org/
2. Unesite: `eko-leventic.hr`
3. Odaberite tip zapisa: **CNAME** (ili **A** ako koristite A Records)
4. Kliknite **"Search"**
5. Provjerite da li DNS zapis propagira globalno

**Očekivano:** DNS zapis bi trebao pokazivati na Vercel (`cname.vercel-dns.com` ili Vercel IP adrese).

---

### Korak 6: Pričekajte DNS Propagaciju

**Vrijeme propagacije:**
- **Minimalno:** 5-15 minuta
- **Obično:** 1-2 sata
- **Maksimalno:** 24-48 sati

**Što se događa tijekom propagacije:**
- Neki korisnici će vidjeti novi web
- Neki korisnici će još uvijek vidjeti stari WordPress web
- To je normalno - DNS propagacija nije instantna

**Preporuka:** Pričekajte barem 1-2 sata prije nego što nastavite s testiranjem.

---

### Korak 7: Provjerite da Novi Web Radi na Glavnoj Domeni

#### A) Provjerite Pristup

1. Otvorite u browseru: `https://eko-leventic.hr`
2. Trebali biste vidjeti novi Astro web (ne WordPress)

**Ako još vidite WordPress:**
- DNS se još propagira - pričekajte
- Očistite browser cache (Ctrl+Shift+Delete)
- Pokušajte u incognito/private mode

#### B) Provjerite SSL Certifikat

1. Provjerite da li je HTTPS aktivan (zelena ikona u browseru)
2. Vercel automatski postavlja SSL certifikat
3. Ako nije aktivan, pričekajte nekoliko minuta

#### C) Testirajte Funkcionalnosti

1. **Shop stranica:**
   - [ ] Proizvodi se prikazuju
   - [ ] Košarica radi
   - [ ] Checkout radi

2. **Narudžbe:**
   - [ ] Napravite test narudžbu
   - [ ] Provjerite da li se email šalje
   - [ ] Provjerite da li se narudžba spremi u Supabase

3. **Admin Panel:**
   - [ ] Pristup: `https://eko-leventic.hr/admin`
   - [ ] Login radi
   - [ ] Proizvodi se prikazuju
   - [ ] Narudžbe se prikazuju

4. **Kontakt Forma:**
   - [ ] Forma se može poslati
   - [ ] Email stiže na `info@eko-leventic.hr`

5. **Ostale Stranice:**
   - [ ] Početna stranica
   - [ ] Recepti stranica
   - [ ] Kontakt stranica
   - [ ] Dostava stranica
   - [ ] Povrati stranica
   - [ ] Politika privatnosti
   - [ ] Uvjeti korištenja

---

### Korak 8: Dodajte www Poddomenu (Opciono)

Ako želite da `www.eko-leventic.hr` također radi:

#### A) Dodajte u Vercel

1. Vercel Dashboard → Vaš projekt → **Settings** → **Domains**
2. Kliknite **"Add"**
3. Unesite: `www.eko-leventic.hr`
4. Kliknite **"Add"**

#### B) Dodajte DNS Zapis

1. U DNS provider-u, dodajte CNAME zapis:
   - **Tip:** `CNAME`
   - **Ime/Host:** `www`
   - **Vrijednost/Cilj:** `cname.vercel-dns.com`
   - **TTL:** `3600`

2. Sačuvajte promjene

#### C) Provjerite

1. Pričekajte DNS propagaciju
2. Provjerite: `https://www.eko-leventic.hr`
3. Trebao bi raditi i preusmjeravati na `https://eko-leventic.hr`

---

### Korak 9: Uklonite Poddomenu (Opciono)

Ako više ne trebate poddomenu (npr. `new.eko-leventic.hr`):

#### A) Uklonite iz Vercel

1. Vercel Dashboard → Vaš projekt → **Settings** → **Domains**
2. Pronađite poddomenu (npr. `new.eko-leventic.hr`)
3. Kliknite na poddomenu
4. Kliknite **"Remove"** ili **"Delete"**
5. Potvrdite brisanje

#### B) Uklonite DNS Zapis (Opciono)

Ako želite potpuno ukloniti poddomenu:

1. U DNS provider-u, pronađite CNAME zapis za poddomenu
2. Obrišite zapis
3. Sačuvajte promjene

**Napomena:** Možete zadržati poddomenu ako želite - neće smetati.

---

## 🆘 Troubleshooting

### Problem: DNS ne propagira nakon 24 sata

**Rješenje:**
1. Provjerite da li je DNS zapis ispravan u DNS provider-u
2. Provjerite da li je DNS zapis sačuvan
3. Provjerite da li nema konflikta s drugim DNS zapisima
4. Kontaktirajte DNS provider podršku
5. Provjerite da li koristite ispravan DNS zapis (CNAME ili A Records)

---

### Problem: "Invalid Configuration" u Vercel

**Rješenje:**
1. Provjerite da li je DNS zapis ispravan
2. Provjerite da li je DNS zapis propagirao (koristite dnschecker.org)
3. Provjerite da li je CNAME postavljen na `cname.vercel-dns.com`
4. Provjerite da li nema konflikta s drugim DNS zapisima
5. Ako koristite A Records, provjerite da li su sve IP adrese dodane

---

### Problem: SSL Certifikat ne radi

**Rješenje:**
1. Vercel automatski postavlja SSL certifikat
2. Pričekajte nekoliko minuta nakon dodavanja domene
3. Provjerite da li je DNS zapis propagirao
4. Provjerite da li je domena validna u Vercel Dashboard-u
5. Ako problem traje, kontaktirajte Vercel podršku

---

### Problem: Stranica se ne učitava / 404 Error

**Rješenje:**
1. Provjerite Vercel logs: **Deployments** → **View Function Logs**
2. Provjerite da li je build uspješan
3. Provjerite environment varijable
4. Provjerite da li je aplikacija redeployana nakon dodavanja domene
5. Provjerite da li je domena dodana u Vercel

---

### Problem: Još uvijek vidim WordPress web

**Rješenje:**
1. DNS se još propagira - pričekajte (može potrajati do 24 sata)
2. Očistite browser cache (Ctrl+Shift+Delete)
3. Pokušajte u incognito/private mode
4. Provjerite DNS propagaciju na dnschecker.org
5. Provjerite da li je DNS zapis ispravan

---

### Problem: Emailovi se ne šalju

**Rješenje:**
1. Provjerite da li je Resend domena verificirana (ako koristite Resend)
2. Provjerite Resend API ključ u Vercel environment varijablama
3. Provjerite Vercel logs za email greške
4. Provjerite da li su email adrese ispravne u kodu

---

## 📋 Finalni Checklist

### Prije Prebacivanja:
- [x] Backup WordPress fajlova
- [x] Backup WordPress baze podataka
- [ ] Sve funkcionalnosti testirane na poddomeni
- [ ] DNS provider identificiran
- [ ] Pristup DNS upravljanju

### Tijekom Prebacivanja:
- [ ] Glavna domena dodana u Vercel
- [ ] DNS zapis promijenjen
- [ ] DNS propagacija provjerena
- [ ] SSL certifikat aktivan

### Nakon Prebacivanja:
- [ ] Novi web radi na `https://eko-leventic.hr`
- [ ] Shop stranica radi
- [ ] Checkout radi
- [ ] Narudžbe se spremaju u Supabase
- [ ] Emailovi se šalju
- [ ] Admin panel radi
- [ ] Kontakt forma radi
- [ ] Sve stranice se učitavaju ispravno
- [ ] www poddomena dodana (opcionalno)
- [ ] Stara poddomena uklonjena (opcionalno)

---

## 🎯 Važne Napomene

### 1. DNS Propagacija

- DNS promjene nisu instantne
- Može potrajati nekoliko minuta do 24 sata
- Tijekom propagacije, neki korisnici će vidjeti novi web, neki stari
- To je normalno - pričekajte da se propagacija završi

### 2. Backup

- **VAŽNO:** Imate backup WordPress fajlova i baze podataka
- Ako nešto pođe po zlu, možete vratiti WordPress web
- Backup je vaš "sigurnosni mreža"

### 3. Email

- Email adrese (`info@eko-leventic.hr`) će i dalje raditi
- Email nije vezan za DNS promjene
- Provjerite da li je Resend domena verificirana (ako koristite Resend)

### 4. Testiranje

- Testirajte sve funkcionalnosti nakon prebacivanja
- Napravite test narudžbu
- Provjerite admin panel
- Provjerite kontakt formu

---

## 📚 Dodatni Resursi

- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [DNS Propagation Checker](https://dnschecker.org/)
- [Vercel DNS Configuration](https://vercel.com/docs/concepts/projects/domains/add-a-domain)

---

**Sretno s prebacivanjem! 🚀**

Ako imate problema, provjerite Troubleshooting sekciju ili kontaktirajte podršku.

