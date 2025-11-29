# 🍞 Recepti Stranica - Dokumentacija

## ✅ Što je kreirano?

Potpuno funkcionalna stranica sa **9 recepata** sa vaše web stranice https://eko-leventic.hr/recepti/

---

## 📄 Kreirani Fajlovi

### 1. **`src/data/recipes.ts`**
- Sadrži sve recepte sa detaljnim informacijama
- 9 recepata: Pirov kruh, Fokača, Palačinke, Čokoladne buhtlice, Vafli, Tortilje, Soparnik, Varaždinski klipić, Fitness kolač
- Svaki recept ima: sastojke, postupak, vrijeme pripreme, težinu, kategoriju

### 2. **`src/components/RecipeCard.tsx`**
- Komponenta za prikaz kartice recepta
- Prikazuje sliku, naslov, kategoriju, težinu, vrijeme
- Gumb "Pogledaj recept" otvara modal sa detaljima

### 3. **`src/components/RecipeModal.tsx`**
- Modal sa potpunim detaljima recepta
- Prikazuje sve sastojke i postupak pripreme korak-po-korak
- Gumb za printanje recepta

### 4. **`src/components/RecipesPage.tsx`**
- Glavna stranica sa svim receptima
- Filter po kategorijama (Sve, Kruh, Slasno, Slatko)
- Responzivni grid sa karticama
- Hero sekcija i info sekcija

### 5. **`src/pages/recepti.astro`**
- Astro stranica koja renderira RecipesPage komponentu
- Dostupna na: `http://localhost:4321/recepti`

### 6. **`src/components/Header.tsx`** (ažurirano)
- Dodan link "Recepti" u navigaciju

---

## 🎯 Funkcionalnosti

### ✨ Filter po Kategorijama
- **Sve** - Prikazuje svih 9 recepata
- **🍞 Kruh** - 2 recepta (Pirov kruh, Fokača)
- **🥗 Slasno** - 2 recepta (Tortilje, Soparnik)
- **🍰 Slatko** - 5 recepata (Palačinke, Čokoladne buhtlice, Vafli, Varaždinski klipić, Fitness kolač)

### 📊 Oznake Težine
- **Lako** 🟢 - Jednostavni recepti za početnike
- **Srednje** 🟡 - Recepti koji zahtijevaju malo više vremena
- **Teško** 🔴 - Kompleksniji recepti (trenutno samo Varaždinski klipić)

### 🔍 Detaljan Pregled Recepta
Klik na "Pogledaj recept" otvara modal sa:
- Velikom slikom recepta
- Potpunim popisom sastojaka
- Postupkom pripreme korak-po-korak
- Info o vremenu pripreme i pečenja
- Broju porcija
- Gumbom za printanje

### 🖨️ Print Funkcionalnost
- Svaki recept se može ispisati
- Optimizirano za A4 format

---

## 🎨 Dizajn

### Boje i Stil
- **Primarna boja:** Zelena (#16a34a) - odgovara eko brendu
- **Responzivni dizajn:** Radi na svim uređajima (mobitel, tablet, desktop)
- **Moderni UI:** Kartice sa hover efektima, zaobljeni rubovi, sjene

### Layout
- **Grid:** 1 kolona (mobitel), 2 kolone (tablet), 3 kolone (desktop)
- **Hero sekcija:** Gradient pozadina sa naslovom
- **Info sekcija:** 3 kartice sa prednostima

---

## 📋 Recepti

### 1. Pirov Kruh 🍞
- **Kategorija:** Kruh
- **Težina:** Srednje
- **Priprema:** 20 min | **Pečenje:** 45 min
- **Sastojci:** 6 | **Koraci:** 6

### 2. Fokača od Pirovog Brašna 🍞
- **Kategorija:** Kruh
- **Težina:** Lako
- **Priprema:** 15 min | **Pečenje:** 25 min
- **Sastojci:** 6 | **Koraci:** 6

### 3. Palačinke od Pirovog Brašna 🥞
- **Kategorija:** Slatko
- **Težina:** Lako
- **Priprema:** 10 min | **Pečenje:** 15 min
- **Sastojci:** 6 | **Koraci:** 6

### 4. Čokoladne Buhtlice 🍫
- **Kategorija:** Slatko
- **Težina:** Srednje
- **Priprema:** 30 min | **Pečenje:** 20 min
- **Sastojci:** 7 | **Koraci:** 6

### 5. Vafli sa Pirovim Brašnom 🧇
- **Kategorija:** Slatko
- **Težina:** Lako
- **Priprema:** 10 min | **Pečenje:** 15 min
- **Sastojci:** 7 | **Koraci:** 6

### 6. Tortilje sa Pirovim Brašnom 🌯
- **Kategorija:** Slasno
- **Težina:** Lako
- **Priprema:** 15 min | **Pečenje:** 20 min
- **Sastojci:** 4 | **Koraci:** 6

### 7. Soparnik od Integralnog Pirovog Brašna 🥬
- **Kategorija:** Slasno
- **Težina:** Srednje
- **Priprema:** 30 min | **Pečenje:** 40 min
- **Sastojci:** 7 | **Koraci:** 6

### 8. Varaždinski Klipić 🍰
- **Kategorija:** Slatko
- **Težina:** Teško
- **Priprema:** 45 min | **Pečenje:** 30 min
- **Sastojci:** 7 | **Koraci:** 6

### 9. Fitness Voćni Kolač 🍎
- **Kategorija:** Slatko
- **Težina:** Lako
- **Priprema:** 20 min | **Pečenje:** 35 min
- **Sastojci:** 7 | **Koraci:** 6

---

## 🚀 Kako Testirati

### 1. Pokrenite Development Server
```bash
npm run dev
```

### 2. Otvorite Stranicu
```
http://localhost:4321/recepti
```

### 3. Testirajte Funkcionalnosti
- ✅ Kliknite filter "Kruh" - trebali biste vidjeti 2 recepta
- ✅ Kliknite filter "Slatko" - trebali biste vidjeti 5 recepata
- ✅ Kliknite "Pogledaj recept" na bilo kojem receptu
- ✅ Pogledajte detalje, sastojke i postupak
- ✅ Kliknite "Ispiši recept"
- ✅ Zatvorite modal

### 4. Provjera Responzivnosti
- Otvorite Chrome Dev Tools (F12)
- Kliknite toggle device toolbar
- Testirajte na različitim veličinama ekrana

---

## 📸 Slike

### Postojeće Slike (koriste se trenutno)
- `Eko_bijelo_pirovo_brasno_pizza.jpg` → Tortilje
- `Eko_integralno_pirovo_brasno_pizza.jpg` → Soparnik
- `Eko_bijelo_pirovo_brasno_kolac.jpg` → Varaždinski klipić

### Slike koje Trebate Dodati
Za najbolje iskustvo, dodajte prave slike recepata iz vaše stranice:

```
public/
├── Kruh_od_pirovog_brasna.jpg
├── Fokaca_od_pirovog_brasna.jpg
├── Palačinke_od_pirovog_brašna.jpg
├── Čokoladne_buhtlice.jpg
├── Vafli-od-pirovog-integralnog-brasna.jpg
└── Fitness_vocni_kolac_sa_integralnim_pirovim_brasnom.jpg
```

**Detalje vidi u:** `RECEPTI_SLIKE.md`

---

## 🔄 Kako Ažurirati Recepte

### Dodavanje Novog Recepta

Otvorite `src/data/recipes.ts` i dodajte novi objekt u `recipes` array:

```typescript
{
  id: '10',
  title: 'Novi Recept',
  image: '/slika_recepta.jpg',
  category: 'slatko', // ili 'kruh' ili 'slasno'
  description: 'Kratak opis recepta',
  difficulty: 'lako', // ili 'srednje' ili 'teško'
  prepTime: '15 min',
  cookTime: '30 min',
  servings: '4 osobe',
  ingredients: [
    'Sastojak 1',
    'Sastojak 2',
    // ...
  ],
  instructions: [
    'Korak 1',
    'Korak 2',
    // ...
  ],
}
```

### Uređivanje Postojećeg Recepta

1. Otvorite `src/data/recipes.ts`
2. Pronađite recept po ID-u
3. Ažurirajte bilo koje polje
4. Spremite fajl
5. Stranica će se automatski refreshati

---

## 💡 Dodatne Mogućnosti (Buduće)

### Moguće nadogradnje:
- [ ] Search funkcionalnost
- [ ] Sortiranje po vremenu pripreme
- [ ] Favoriti/spremljeni recepti
- [ ] Share na društvenim mrežama
- [ ] Rating sistema
- [ ] Komentari
- [ ] Video upute
- [ ] Nutritivne vrijednosti
- [ ] Sugestije sličnih recepata

---

## ✅ Checklist

- [x] Kreirano 9 recepata sa detaljima
- [x] Filter po kategorijama
- [x] Modal sa detaljnim prikazom
- [x] Responzivni dizajn
- [x] Print funkcionalnost
- [x] Dodan link u navigaciju
- [x] Hero i info sekcije
- [ ] Dodane prave slike recepata (vidi RECEPTI_SLIKE.md)

---

**Status:** ✅ Stranica je potpuno funkcionalna i spremna za korištenje!

**Sljedeći korak:** Dodajte slike recepata iz vaše postojeće stranice za najbolje korisničko iskustvo.

🎉 Uživajte u novoj stranici sa receptima!

