# 📦 WordPress Backup Baze Podataka - Vodič

Ovaj vodič će vam pomoći da napravite backup WordPress baze podataka prije prebacivanja novog weba na glavnu domenu.

---

## 🎯 Metode za Backup

Postoji nekoliko načina za backup WordPress baze podataka. Odaberite metodu koja vam odgovara ovisno o tome što imate dostupno:

1. **phpMyAdmin** (najlakše - ako imate pristup hosting kontrolnom panelu)
2. **WP-CLI** (ako imate SSH pristup)
3. **MySQL komande** (ako imate SSH pristup)
4. **WordPress plugin** (ako imate pristup WordPress admin panelu)

---

## 📋 Metoda 1: phpMyAdmin (Preporučeno)

### Korak 1: Pristup phpMyAdmin

1. Prijavite se u hosting kontrolni panel (cPanel, Plesk, ili drugi)
2. Pronađite **phpMyAdmin** u sekciji "Databases" ili "Database Tools"
3. Kliknite na phpMyAdmin da se otvori

### Korak 2: Pronađite WordPress Bazu

1. U lijevom sidebaru, pronađite bazu podataka koja se koristi za WordPress
   - Obično ima naziv kao: `korisnik_wp`, `korisnik_wordpress`, ili slično
   - Možete provjeriti u `wp-config.php` fajlu (tražite `DB_NAME`)

### Korak 3: Export Baze

1. **VAŽNO:** Kliknite na tab **"Export"** na vrhu stranice (pored "Structure", "SQL", "Search", itd.)
   - **NE trebate odabirati tablice pojedinačno!**
   - Kada kliknete na "Export" tab, phpMyAdmin automatski će exportirati **SVE tablice** iz baze
   
2. Odaberite metodu:
   - **"Quick"** - brza metoda (preporučeno za većinu slučajeva)
   - **"Custom"** - napredne opcije (ako trebate specifične postavke)

### Korak 4: Postavke Export-a

**Za Quick metodu:**
- Format: **SQL** (već je odabrano)
- **Sve tablice su automatski odabrane** - ne trebate ništa mijenjati
- Kliknite **"Go"** ili **"Export"** gumb na dnu stranice

**Za Custom metodu (preporučeno za veće baze):**
- Format: **SQL**
- Compression: Odaberite **"zipped"** ili **"gzipped"** (smanjuje veličinu fajla)
- **Tablica odabir:** 
  - ✅ Provjerite da li su **SVE tablice odabrane** (obično su automatski)
  - Ako nisu, kliknite **"Select All"** ili označite sve checkbox-ove
- Structure: ✅ Označite sve opcije
- Data: ✅ Označite sve opcije
- Kliknite **"Go"** ili **"Export"** gumb na dnu stranice

**Napomena:** Ako vidite listu tablica u Export tabu, to je samo za pregled - sve su automatski odabrane za export.

### Korak 5: Sačuvajte Backup

1. Browser će automatski preuzeti SQL fajl
2. Spremite fajl na sigurno mjesto:
   - Lokalni računalo (u folder za backup)
   - Cloud storage (Google Drive, Dropbox, OneDrive)
   - External drive (USB, external HDD)

**Preporučeni naziv fajla:**
```
wordpress_backup_YYYY-MM-DD.sql
```
Primjer: `wordpress_backup_2024-01-15.sql`

---

## 📋 Metoda 2: WP-CLI (SSH pristup potreban)

Ako imate SSH pristup i WP-CLI instaliran:

### Korak 1: Pristup SSH

```bash
ssh korisnik@eko-leventic.hr
# ili
ssh korisnik@IP_ADRESA
```

### Korak 2: Navigirajte u WordPress Direktorij

```bash
cd /path/to/wordpress
# Primjer: cd /home/korisnik/public_html
# ili: cd /var/www/html
```

### Korak 3: Export Baze

```bash
wp db export wordpress_backup_$(date +%Y-%m-%d).sql
```

Ovo će kreirati SQL fajl s datumom u nazivu.

### Korak 4: Kompresujte Backup (Opciono)

```bash
gzip wordpress_backup_*.sql
```

### Korak 5: Preuzmite Backup

```bash
# Ako koristite SCP:
scp korisnik@eko-leventic.hr:/path/to/wordpress/wordpress_backup_*.sql.gz ./

# Ako koristite FTP/SFTP:
# Preuzmite fajl preko FTP klijenta
```

---

## 📋 Metoda 3: MySQL Komande (SSH pristup potreban)

Ako imate SSH pristup ali nemate WP-CLI:

### Korak 1: Pristup SSH

```bash
ssh korisnik@eko-leventic.hr
```

### Korak 2: Export Baze

```bash
mysqldump -u DB_KORISNIK -p DB_NAZIV > wordpress_backup_$(date +%Y-%m-%d).sql
```

**Zamijenite:**
- `DB_KORISNIK` - korisničko ime baze podataka
- `DB_NAZIV` - naziv baze podataka

**Primjer:**
```bash
mysqldump -u korisnik_wp -p korisnik_wordpress > wordpress_backup_2024-01-15.sql
```

Sustav će tražiti lozinku - unesite lozinku za bazu podataka.

**Napomena:** Lozinku možete pronaći u `wp-config.php` fajlu (tražite `DB_PASSWORD`).

### Korak 3: Kompresujte Backup

```bash
gzip wordpress_backup_*.sql
```

### Korak 4: Preuzmite Backup

```bash
# SCP:
scp korisnik@eko-leventic.hr:/path/to/wordpress_backup_*.sql.gz ./

# FTP/SFTP:
# Preuzmite fajl preko FTP klijenta
```

---

## 📋 Metoda 4: WordPress Plugin

Ako imate pristup WordPress admin panelu:

### Korak 1: Instalirajte Plugin

1. WordPress Admin → **Plugins** → **Add New**
2. Pretražite: **"UpdraftPlus"** ili **"All-in-One WP Migration"**
3. Instalirajte i aktivirajte plugin

### Korak 2: Napravite Backup

**UpdraftPlus:**
1. **Settings** → **UpdraftPlus Backups**
2. Kliknite **"Backup Now"**
3. Odaberite što želite backup-ovati (Database, Files, ili oboje)
4. Kliknite **"Backup Now"**
5. Sačekajte da se backup završi
6. Download backup fajl

**All-in-One WP Migration:**
1. **All-in-One WP Migration** → **Export**
2. Odaberite **"Export to File"**
3. Sačekajte da se export završi
4. Download fajl

### Korak 3: Sačuvajte Backup

Preuzmite backup fajl i spremite ga na sigurno mjesto.

---

## 🔍 Kako Pronaći Podatke za Pristup Bazi

Ako ne znate podatke za pristup bazi podataka:

### Opcija 1: Provjerite wp-config.php

1. Pristupite WordPress direktoriju preko FTP/SFTP
2. Otvorite `wp-config.php` fajl
3. Pronađite sljedeće linije:

```php
define('DB_NAME', 'naziv_baze');
define('DB_USER', 'korisnik_baze');
define('DB_PASSWORD', 'lozinka_baze');
define('DB_HOST', 'localhost');
```

### Opcija 2: Provjerite Hosting Kontrolni Panel

1. Prijavite se u hosting kontrolni panel
2. Idite u sekciju **"Databases"** ili **"MySQL Databases"**
3. Tamo ćete vidjeti sve baze podataka i njihove podatke

---

## ✅ Provjera Backup-a

Nakon što napravite backup, preporučujem da provjerite da li je backup ispravan:

### Provjera 1: Veličina Fajla

1. Pronađite preuzeti SQL fajl na vašem računalu
2. Desni klik na fajl → **"Properties"** (Windows) ili **"Get Info"** (Mac)
3. Provjerite veličinu:
   - ✅ **Dobro:** Fajl je veći od 0 KB (obično 100 KB - nekoliko MB)
   - ❌ **Loše:** Fajl je 0 KB ili vrlo mali (manje od 10 KB) - backup nije uspio

**Ako je fajl komprimiran (.zip, .gz):**
- Komprimirani fajl može biti manji, ali ne smije biti 0 KB
- Decompressirajte fajl prije provjere (desni klik → Extract)

---

### Provjera 2: Otvaranje i Pregled SQL Fajla

**Kako otvoriti SQL fajl:**

#### Opcija A: Notepad / Text Editor (Windows)

1. Desni klik na SQL fajl
2. Odaberite **"Open with"** → **"Notepad"** ili **"Notepad++"**
3. Ako fajl nije na listi, kliknite **"Choose another app"** i odaberite Notepad

**Napomena:** Ako je fajl vrlo velik (preko 10-20 MB), Notepad može biti spor. Koristite Notepad++ ili VS Code.

#### Opcija B: Notepad++ (Preporučeno za Windows)

1. Preuzmite i instalirajte [Notepad++](https://notepad-plus-plus.org/) (besplatno)
2. Desni klik na SQL fajl → **"Open with"** → **"Notepad++"**
3. Notepad++ je brži i bolji za velike fajlove

#### Opcija C: VS Code (Ako ga imate)

1. Desni klik na SQL fajl → **"Open with"** → **"Visual Studio Code"**
2. VS Code je odličan za pregled velikih fajlova

#### Opcija D: Mac Text Editor

1. Desni klik na SQL fajl → **"Open With"** → **"TextEdit"** ili **"VS Code"**

---

### Provjera 3: Što Tražiti u SQL Fajlu

Kada otvorite SQL fajl, provjerite sljedeće:

#### ✅ Dobar Znak - Fajl Trebao Bi Počinjati S:

```sql
-- MySQL dump 10.13  Distrib 5.7.xx, for Linux (x86_64)
--
-- Host: localhost    Database: ekoleven_wp1
-- ------------------------------------------------------
-- Server version	5.7.xx

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
```

Ili:

```sql
CREATE TABLE `wp_posts` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  ...
```

#### ✅ Dobar Znak - Trebao Bi Sadržavati WordPress Tablice

Pritisnite **Ctrl+F** (ili Cmd+F na Mac) i pretražite:

- `CREATE TABLE` - trebao bi biti više puta (za svaku tablicu)
- `wp_posts` - WordPress postovi
- `wp_users` - WordPress korisnici
- `wp_options` - WordPress postavke
- `INSERT INTO` - podaci iz tablica

**Primjer što biste trebali vidjeti:**

```sql
CREATE TABLE `wp_posts` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_author` bigint(20) unsigned NOT NULL DEFAULT '0',
  ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wp_posts` VALUES (1,1,'2024-01-01 12:00:00','2024-01-01 12:00:00',...);
```

#### ❌ Loš Znak - Ako Vidite:

- Prazan fajl
- Samo greške (ERROR, WARNING)
- Samo komentare bez CREATE TABLE ili INSERT INTO
- Fajl koji se ne može otvoriti (korumpiran)

---

### Provjera 4: Brza Provjera - Pretraga Ključnih Riječi

Otvorite SQL fajl i pretražite (Ctrl+F / Cmd+F) sljedeće riječi:

1. **`CREATE TABLE`** - Trebao bi se pojaviti više puta (jedan za svaku tablicu)
2. **`wp_`** - Trebao bi se pojaviti mnogo puta (WordPress tablice)
3. **`INSERT INTO`** - Trebao bi se pojaviti mnogo puta (podaci)
4. **`ekoleven_wp1`** ili naziv vaše baze - Trebao bi se pojaviti u komentarima

**Ako sve ovo vidite → Backup je ispravan! ✅**

---

### Provjera 5: Test Restore (Opciono - Za Napredne)

Ako želite biti 100% sigurni, možete testirati restore na test okruženju:

1. Kreirajte novu test bazu podataka u phpMyAdmin
2. Idite u test bazu → **"Import"** tab
3. Odaberite backup SQL fajl
4. Kliknite **"Go"**
5. Provjerite da li su sve tablice importirane
6. Provjerite da li ima podataka u tablicama

**Napomena:** Ovo je opcionalno - ako fajl ima ispravan sadržaj (CREATE TABLE, INSERT INTO), backup je vjerojatno ispravan.

---

### 📋 Brza Checklist Provjere

- [ ] Fajl nije 0 KB
- [ ] Fajl se može otvoriti u text editoru
- [ ] Fajl počinje s `-- MySQL dump` ili `CREATE TABLE`
- [ ] Fajl sadrži `CREATE TABLE` (više puta)
- [ ] Fajl sadrži `wp_` tablice
- [ ] Fajl sadrži `INSERT INTO` (podaci)
- [ ] Fajl nije korumpiran (može se čitati)

---

## 📁 Gdje Spremiti Backup

**Preporučeno:**
- ✅ Lokalni računalo (u poseban folder za backup)
- ✅ Cloud storage (Google Drive, Dropbox, OneDrive) - **enkriptirano**
- ✅ External drive (USB, external HDD)
- ✅ Hosting kontrolni panel (ako ima backup opciju)

**NE spremajte:**
- ❌ Na istom serveru gdje je WordPress (ako server padne, izgubit ćete backup)
- ❌ U javnom folderu na serveru
- ❌ Na nešifriranom cloud storage-u bez dodatne zaštite

---

## 🎯 Checklist Prije Prebacivanja na Glavnu Domenu

- [ ] Backup WordPress fajlova (već napravljeno ✅)
- [ ] Backup WordPress baze podataka (u tijeku)
- [ ] Backup spremljen na sigurno mjesto (lokalno + cloud)
- [ ] Provjera da li backup fajl nije prazan
- [ ] Dokumentacija o lokaciji backup-a

---

## 🆘 Troubleshooting

### Problem: Ne mogu pristupiti phpMyAdmin

**Rješenje:**
- Provjerite da li je phpMyAdmin omogućen u hosting kontrolnom panelu
- Kontaktirajte hosting podršku
- Koristite alternativnu metodu (WP-CLI, MySQL komande, plugin)

### Problem: Backup fajl je prevelik

**Rješenje:**
- Koristite kompresiju (gzip, zip)
- U phpMyAdmin odaberite "Custom" metodu i "zipped" kompresiju
- Podijelite backup na manje dijelove (ako je potrebno)

### Problem: Ne znam podatke za pristup bazi

**Rješenje:**
- Provjerite `wp-config.php` fajl
- Provjerite hosting kontrolni panel → Databases sekcija
- Kontaktirajte hosting podršku

### Problem: Backup ne radi preko SSH

**Rješenje:**
- Provjerite da li imate SSH pristup
- Provjerite da li su MySQL komande dostupne
- Provjerite dozvole za kreiranje fajlova
- Koristite phpMyAdmin ili plugin metodu

---

## 📝 Napomene

- **Veličina backup-a:** Ovisi o veličini WordPress stranice. Obično je između 1-50 MB.
- **Vrijeme backup-a:** Obično traje nekoliko sekundi do nekoliko minuta, ovisno o veličini.
- **Frekvencija backup-a:** Preporučujem backup prije svake veće promjene.

---

## ✅ Nakon Backup-a

Kada napravite backup:

1. **Spremite backup na sigurno mjesto** (lokalno + cloud)
2. **Zabilježite lokaciju backup-a** (gdje ste ga spremili)
3. **Provjerite da li backup radi** (otvorite SQL fajl i provjerite sadržaj)
4. **Nastavite s prebacivanjem na glavnu domenu** kada ste sigurni da imate backup

---

## 📁 Provjera Backup-a Fajlova

Ako ste napravili backup WordPress fajlova (npr. `public_html_backup_2026-01-07.zip`), evo kako provjeriti da li je ispravan:

### Provjera 1: Veličina i Status Fajla

**Što provjeriti:**
- ✅ **Veličina:** Backup fajl ne bi trebao biti 0 KB
- ✅ **Tip fajla:** Trebao bi biti komprimiran (`.zip`, `.tar.gz`, ili slično)
- ✅ **Datum:** Provjerite da li je datum backup-a nedavno (kada ste ga napravili)

**Primjer ispravnog backup-a:**
- Naziv: `public_html_backup_2026-01-07.zip`
- Veličina: 326,751 KB (oko 326 MB) ✅
- Tip: Compressed (zipped) ✅
- Datum: 07/01/2026 12:25 ✅

**Ako je fajl:**
- 0 KB → Backup nije uspio ❌
- Vrlo mali (manje od 1 MB) → Možda nije sve backup-ovano ⚠️
- Normalne veličine (100+ MB) → Dobro ✅

---

### Provjera 2: Dekompresija i Pregled Sadržaja

**Kako provjeriti sadržaj:**

#### Korak 1: Dekompresirajte Backup

1. Desni klik na `.zip` fajl
2. Odaberite **"Extract All"** ili **"Extract Here"**
3. Sačekajte da se dekompresija završi

#### Korak 2: Provjerite Strukturu Foldera

Nakon dekompresije, trebali biste vidjeti strukturu WordPress instalacije:

**Očekivana struktura:**
```
public_html_backup_2026-01-07/
├── wp-admin/
├── wp-content/
│   ├── themes/
│   ├── plugins/
│   ├── uploads/
│   └── ...
├── wp-includes/
├── wp-config.php
├── index.php
├── .htaccess
└── (ostali WordPress fajlovi)
```

**Ključni folderi i fajlovi koje trebate provjeriti:**

✅ **wp-content/** - Najvažniji folder!
   - `themes/` - WordPress teme
   - `plugins/` - WordPress pluginovi
   - `uploads/` - Uploadane slike i mediji

✅ **wp-config.php** - Konfiguracijski fajl (sadrži podatke za bazu)

✅ **.htaccess** - Apache konfiguracija (može biti skriven)

✅ **wp-admin/** i **wp-includes/** - WordPress core fajlovi

---

### Provjera 3: Detaljna Provjera Sadržaja

#### Provjera wp-content Foldera

1. Otvorite `wp-content` folder
2. Provjerite da li postoje:
   - ✅ `themes/` folder (s vašim temama)
   - ✅ `plugins/` folder (s vašim pluginovima)
   - ✅ `uploads/` folder (s vašim slikama i medijima)

**Ako ne vidite ove foldere → Backup možda nije kompletan ⚠️**

#### Provjera wp-config.php

1. Pronađite `wp-config.php` fajl u root direktoriju
2. Otvorite ga u Notepad ili text editoru
3. Provjerite da li sadrži:
   ```php
   define('DB_NAME', 'ekoleven_wp1');
   define('DB_USER', '...');
   define('DB_PASSWORD', '...');
   define('DB_HOST', 'localhost');
   ```

**Ako vidite ove linije → Backup je ispravan ✅**

**Napomena:** Ne dijelite `wp-config.php` fajl jer sadrži osjetljive podatke!

---

### Provjera 4: Provjera Veličine Foldera

**Nakon dekompresije, provjerite veličinu:**

1. Desni klik na dekompresirani folder
2. Properties (Windows) ili Get Info (Mac)
3. Provjerite ukupnu veličinu

**Očekivane veličine:**
- **wp-content/uploads/** - Obično najveći folder (slike, mediji)
- **wp-content/themes/** - Vaše teme
- **wp-content/plugins/** - Pluginovi

**Ako je veličina:**
- Slična originalnoj → Dobro ✅
- Značajno manja → Možda nešto nedostaje ⚠️

---

### Provjera 5: Brza Provjera - Pretraga Ključnih Fajlova

**Provjerite da li postoje sljedeći fajlovi:**

1. ✅ `wp-config.php` - WordPress konfiguracija
2. ✅ `index.php` - WordPress index fajl
3. ✅ `.htaccess` - Apache konfiguracija (može biti skriven)
4. ✅ `wp-content/themes/` - Teme folder
5. ✅ `wp-content/plugins/` - Pluginovi folder
6. ✅ `wp-content/uploads/` - Uploads folder

**Ako sve ovo postoji → Backup je ispravan! ✅**

---

### Provjera 6: Test Restore (Opciono - Za Napredne)

Ako želite biti 100% sigurni, možete testirati restore na test okruženju:

1. Kreirajte novi test direktorij
2. Dekompresirajte backup u test direktorij
3. Provjerite da li se fajlovi mogu čitati
4. Provjerite da li struktura izgleda ispravno

**Napomena:** Ovo je opcionalno - ako struktura izgleda ispravno, backup je vjerojatno ispravan.

---

### 📋 Checklist Provjere Backup-a Fajlova

- [ ] Backup fajl nije 0 KB
- [ ] Backup fajl se može dekompresirati
- [ ] Postoji `wp-content/` folder
- [ ] Postoji `wp-content/themes/` folder
- [ ] Postoji `wp-content/plugins/` folder
- [ ] Postoji `wp-content/uploads/` folder
- [ ] Postoji `wp-config.php` fajl
- [ ] Postoji `index.php` fajl
- [ ] Struktura foldera izgleda ispravno
- [ ] Veličina backup-a je razumna (ne previše mali)

---

### 🎯 Vaš Backup Izgleda Ispravno!

Na osnovu slike koju ste poslali:
- ✅ Naziv: `public_html_backup_2026-01-07` - Ispravan format s datumom
- ✅ Veličina: 326,751 KB (326 MB) - Normalna veličina za WordPress backup
- ✅ Tip: Compressed (zipped) - Ispravno komprimiran
- ✅ Datum: 07/01/2026 12:25 - Nedavno napravljen

**Preporuka:** Dekompresirajte fajl i provjerite strukturu (wp-content, wp-config.php) da budete 100% sigurni, ali na osnovu veličine i formata, backup izgleda ispravno! ✅

---

**Sretno s backup-om! 🚀**

