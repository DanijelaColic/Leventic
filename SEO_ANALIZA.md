# 🔍 SEO Analiza - Eko Leventić

## ✅ Što je već postavljeno

### Osnovni SEO elementi:
- ✅ **Title tagovi** - Postavljeni na svim stranicama
- ✅ **Meta description** - Postavljeni na svim stranicama
- ✅ **Lang atribut** - `lang="hr"` postavljen
- ✅ **Viewport meta tag** - Postavljen za responsive design
- ✅ **Favicon** - `/Eco_Leventic_Logo.png`
- ✅ **Robots meta tag** - `noindex, nofollow` na admin stranicama

---

## ❌ Što nedostaje (KRITIČNO)

### 1. Open Graph Tagovi (Facebook, LinkedIn, WhatsApp)
**Zašto je važno:** Poboljšava prikaz kada se link dijeli na društvenim mrežama.

**Nedostaje:**
- `og:title`
- `og:description`
- `og:image`
- `og:url`
- `og:type`
- `og:site_name`

### 2. Twitter Cards
**Zašto je važno:** Poboljšava prikaz na Twitteru.

**Nedostaje:**
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

### 3. Structured Data (JSON-LD)
**Zašto je važno:** Google koristi ovo za rich snippets i bolje razumijevanje sadržaja.

**Nedostaje:**
- Organization schema (za glavnu stranicu)
- Product schema (za shop stranicu i proizvode)
- Recipe schema (za recepte stranicu)
- BreadcrumbList schema (za navigaciju)

### 4. Sitemap.xml
**Zašto je važno:** Pomaže Google-u pronaći i indeksirati sve stranice.

**Nedostaje:** `sitemap.xml` fajl

### 5. Robots.txt
**Zašto je važno:** Kontrolira što search engine-i mogu indeksirati.

**Nedostaje:** `robots.txt` fajl

### 6. Canonical URLs
**Zašto je važno:** Sprječava duplicate content probleme.

**Nedostaje:** Canonical link tagovi na stranicama

### 7. Alt tagovi za slike
**Status:** Treba provjeriti da li sve slike imaju alt atribute

---

## 📊 SEO Score: 4/10

### Trenutno:
- ✅ Osnovni meta tagovi: 8/10
- ❌ Open Graph: 0/10
- ❌ Twitter Cards: 0/10
- ❌ Structured Data: 0/10
- ❌ Sitemap: 0/10
- ❌ Robots.txt: 0/10
- ❌ Canonical URLs: 0/10

---

## 🚀 Preporuke za poboljšanje

### Prioritet 1 (KRITIČNO - Prije live):
1. **Open Graph tagovi** - Dodati u Layout.astro
2. **Sitemap.xml** - Kreirati sitemap
3. **Robots.txt** - Kreirati robots.txt
4. **Canonical URLs** - Dodati canonical link tagove

### Prioritet 2 (VAŽNO - Nakon live):
5. **Structured Data (JSON-LD)** - Dodati Organization, Product, Recipe schema
6. **Twitter Cards** - Dodati Twitter meta tagove
7. **Alt tagovi** - Provjeriti i dodati gdje nedostaje

### Prioritet 3 (OPCIONALNO):
8. **Performance optimizacije** - Image optimization, lazy loading
9. **Schema markup za FAQ** - Ako imate FAQ sekciju
10. **Local Business schema** - Za Google My Business integraciju

---

## 📝 Što treba napraviti

### 1. Ažurirati Layout.astro
Dodati Open Graph, Twitter Cards, i Canonical URLs

### 2. Kreirati sitemap.xml
Lista svih stranica sa prioritetima i changefreq

### 3. Kreirati robots.txt
Dozvoliti indeksiranje javnih stranica, blokirati admin

### 4. Dodati Structured Data
JSON-LD za Organization, Product, Recipe

### 5. Provjeriti Alt tagove
Sve slike trebaju imati descriptive alt atribute

---

## 🎯 Očekivani rezultati nakon implementacije

- **SEO Score:** 4/10 → 9/10
- **Social sharing:** Bolji prikaz na Facebook, Twitter, WhatsApp
- **Google Search:** Rich snippets, bolje pozicioniranje
- **Indexing:** Brže indeksiranje novih stranica

---

**Status:** ⚠️ SEO nije potpuno postavljen - potrebne su izmjene prije live deploya!

