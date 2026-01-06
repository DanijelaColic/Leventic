# 📧 Resend Domain Verification - Vodič

## Problem

Resend ne dozvoljava slanje emailova na druge adrese kada koristite test domain `onboarding@resend.dev`. 
Trebate verificirati vlastitu domenu `eko-leventic.hr`.

---

## Koraci za Verifikaciju Domene

### 1. Idite na Resend Domains

1. Otvorite: https://resend.com/domains
2. Kliknite **"+ Add Domain"** ili **"Add Domain"**

### 2. Unesite Domenu

1. Unesite: `eko-leventic.hr` (bez `www` ili `https://`)
2. Kliknite **"Add"** ili **"Continue"**

### 3. Dodajte DNS Zapis u cPanel

Resend će vam dati DNS zapise koje trebate dodati. Obično su to:

#### SPF Record:
```
Tip: TXT
Ime: @ (ili eko-leventic.hr)
Vrijednost: (Resend će dati točnu vrijednost)
```

#### DKIM Record:
```
Tip: TXT
Ime: (Resend će dati, npr. resend._domainkey)
Vrijednost: (Resend će dati točnu vrijednost)
```

#### DMARC Record (opcionalno, ali preporučeno):
```
Tip: TXT
Ime: _dmarc
Vrijednost: (Resend će dati točnu vrijednost)
```

### 4. Dodajte DNS Zapis u cPanel

1. U cPanel-u → **Zone Editor**
2. Odaberite domenu: `eko-leventic.hr`
3. Kliknite **"+ TXT Record"** (ne CNAME!)
4. Dodajte svaki zapis koji Resend traži:
   - SPF
   - DKIM
   - DMARC (opcionalno)

### 5. Pričekajte Verifikaciju

- Resend automatski provjerava DNS zapise
- Može potrajati 5-30 minuta (ponekad do 24 sata)
- Status će se promijeniti na "Verified" kada je gotovo

---

## Privremeno Rješenje (Dok Ne Verificirate Domenu)

Ako trebate brzo testirati, možemo privremeno promijeniti "to" adresu na `dgaric1@gmail.com`, 
ali to nije dugoročno rješenje.

---

## Nakon Verifikacije

Kada je domena verificirana, trebate promijeniti "from" adrese u kodu:
- `onboarding@resend.dev` → `noreply@eko-leventic.hr` (ili `info@eko-leventic.hr`)

