# 🔐 Promjena Admin Lozinke

## 📋 Kako Promijeniti Admin Lozinku

Admin lozinka se čuva u environment varijabli `ADMIN_PASSWORD`. Evo kako je promijeniti:

---

## 🖥️ Lokalno (Development)

### Korak 1: Otvorite `.env` fajl

U root direktoriju projekta otvorite ili kreirajte `.env` fajl.

### Korak 2: Promijenite Lozinku

Pronađite ili dodajte liniju:
```env
ADMIN_PASSWORD=vasa_nova_sigurna_lozinka
```

**Primjer:**
```env
# Prije
ADMIN_PASSWORD=stara_lozinka

# Poslije
ADMIN_PASSWORD=MojaNovaSigurnaLozinka123!
```

### Korak 3: Restartajte Server

**VAŽNO:** Nakon promjene `.env` fajla, morate restartati development server:

```bash
# Zaustavite server (Ctrl+C u terminalu)
# Zatim pokrenite ponovno:
npm run dev
```

### Korak 4: Testirajte

1. Otvorite: `http://localhost:4321/admin`
2. Unesite novu lozinku
3. Provjerite da li login radi

---

## ☁️ U Vercel (Production)

### Korak 1: Otvorite Vercel Dashboard

1. Idite na [Vercel Dashboard](https://vercel.com/dashboard)
2. Kliknite na vaš projekt

### Korak 2: Otvorite Environment Variables

1. Kliknite **Settings** (u gornjem meniju)
2. Kliknite **Environment Variables** (u lijevom meniju)

### Korak 3: Pronađite i Uredite `ADMIN_PASSWORD`

1. Pronađite `ADMIN_PASSWORD` u listi varijabli
2. Kliknite na **"..."** (tri točke) pored varijable
3. Kliknite **"Edit"**

### Korak 4: Unesite Novu Lozinku

1. U polje **Value** unesite novu lozinku
2. Provjerite da je odabrano **"Production"** (ili sve okruženja)
3. Kliknite **"Save"**

### Korak 5: Redeploy Aplikacije

**VAŽNO:** Nakon promjene environment varijable, morate redeployati aplikaciju:

1. Idite na **Deployments** (u gornjem meniju)
2. Kliknite na najnoviji deployment
3. Kliknite **"..."** (tri točke)
4. Kliknite **"Redeploy"**
5. Potvrdite redeploy

**Alternativno:** Napravite novi commit i push (Vercel će automatski deployati)

### Korak 6: Testirajte

1. Otvorite vašu live stranicu: `https://vasa-domena.vercel.app/admin` (ili vašu domenu)
2. Unesite novu lozinku
3. Provjerite da li login radi

---

## 🔒 Preporuke za Sigurnu Lozinku

### ✅ DOBRO:
- Najmanje 12 znakova
- Kombinacija velikih i malih slova (A-Z, a-z)
- Brojevi (0-9)
- Specijalni znakovi (!@#$%^&*)
- Primjer: `EkoLeventic2024!Admin`

### ❌ IZBJEGAVAJTE:
- Kratke lozinke (manje od 8 znakova)
- Jednostavne riječi (npr. "password", "admin")
- Osobne podatke (ime, datum rođenja)
- Lozinke koje se lako pogode
- Iste lozinke koje koristite drugdje

---

## 🆘 Troubleshooting

### Problem: "Neispravna lozinka" nakon promjene

**Rješenje:**
1. Provjerite da li ste ispravno unijeli lozinku u `.env` (lokalno) ili Vercel (production)
2. Provjerite da nema razmaka prije ili poslije lozinke
3. **Restartajte server** (lokalno) ili **redeployajte** (Vercel)
4. Provjerite da li koristite novu lozinku (ne staru)

### Problem: Lozinka ne radi u Vercel

**Rješenje:**
1. Provjerite da li je `ADMIN_PASSWORD` postavljen za **"Production"** okruženje
2. Provjerite da li ste **redeployali** aplikaciju nakon promjene
3. Provjerite Vercel logs za greške: **Deployments** → **View Function Logs**

### Problem: Zaboravljena lozinka

**Rješenje:**
1. Lokalno: Provjerite `.env` fajl
2. Vercel: Provjerite **Settings** → **Environment Variables**
3. Ako ne možete pristupiti, možete postaviti novu lozinku u Vercel

---

## 📝 Checklist

### Lokalno:
- [ ] Otvoren `.env` fajl
- [ ] Promijenjena `ADMIN_PASSWORD` vrijednost
- [ ] Server restartan (`npm run dev`)
- [ ] Testiran login s novom lozinkom

### Vercel:
- [ ] Otvoren Vercel Dashboard
- [ ] Pronađena `ADMIN_PASSWORD` varijabla
- [ ] Promijenjena vrijednost
- [ ] Aplikacija redeployana
- [ ] Testiran login s novom lozinkom

---

## 💡 Napomena

- **Nikada ne commitajte `.env` fajl u Git!** (već je u `.gitignore`)
- Lozinka se čuva kao plain text u environment varijablama (za jednostavnost)
- Za veću sigurnost, razmislite o implementaciji hashiranja lozinke u budućnosti
- Redovito mijenjajte lozinku (npr. svakih 3-6 mjeseci)

---

**Datum zadnje promjene:** _______________
**Nova lozinka postavljena:** ⬜ Lokalno / ⬜ Vercel / ⬜ Oba

