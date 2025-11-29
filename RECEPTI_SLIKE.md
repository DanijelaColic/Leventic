# 📸 Slike za Recepte - Instrukcije

## Slike koje trebate dodati u `public/` folder

Preuzmite slike sa vaše postojeće stranice i dodajte ih u `public/` direktorij sa sljedećim imenima:

### 1. Kruh_od_pirovog_brasna.jpg
- **Recept:** Pirov kruh
- **Izvor:** https://eko-leventic.hr/recepti/

### 2. Fokaca_od_pirovog_brasna.jpg
- **Recept:** Fokača od pirovog brašna
- **Izvor:** https://eko-leventic.hr/recepti/

### 3. Palačinke_od_pirovog_brašna.jpg
- **Recept:** Palačinke od pirovog brašna
- **Izvor:** https://eko-leventic.hr/recepti/ (Palačinke_od_pirovog_brašna.jpg)

### 4. Čokoladne_buhtlice.jpg
- **Recept:** Čokoladne buhtlice
- **Izvor:** https://eko-leventic.hr/recepti/

### 5. Vafli-od-pirovog-integralnog-brasna.jpg
- **Recept:** Vafli sa pirovim brašnom
- **Izvor:** https://eko-leventic.hr/recepti/

### 6. Fitness_vocni_kolac_sa_integralnim_pirovim_brasnom.jpg
- **Recept:** Fitness voćni kolač
- **Izvor:** https://eko-leventic.hr/recepti/

---

## Privremena rješenja

Za recepte koji trenutno koriste postojeće slike:

- **Tortilje sa pirovim brašnom** → koristi `/Eko_bijelo_pirovo_brasno_pizza.jpg` (već postoji)
- **Soparnik** → koristi `/Eko_integralno_pirovo_brasno_pizza.jpg` (već postoji)
- **Varaždinski klipić** → koristi `/Eko_bijelo_pirovo_brasno_kolac.jpg` (već postoji)

---

## Kako dodati slike

1. **Preuzmite slike** sa https://eko-leventic.hr/recepti/
   - Desni klik na sliku → Spremi sliku kao...
   
2. **Kopirajte u public folder:**
   ```
   Leventic/
   └── public/
       ├── Kruh_od_pirovog_brasna.jpg
       ├── Fokaca_od_pirovog_brasna.jpg
       ├── Palačinke_od_pirovog_brašna.jpg
       ├── Čokoladne_buhtlice.jpg
       ├── Vafli-od-pirovog-integralnog-brasna.jpg
       └── Fitness_vocni_kolac_sa_integralnim_pirovim_brasnom.jpg
   ```

3. **Restart development servera:**
   ```bash
   # Ctrl+C da zaustavite server
   npm run dev
   ```

4. **Otvorite stranicu:**
   ```
   http://localhost:4321/recepti
   ```

---

## Alternativa - Koristite Supabase Storage

Ako želite koristiti Supabase za hostanje slika:

1. Idite na Supabase Dashboard → Storage
2. Kreirajte bucket "recipe-images"
3. Uploadajte slike
4. Kopirajte javne URL-ove
5. Zamijenite putanje u `src/data/recipes.ts`

---

**Napomena:** Trenutno će recepti raditi i sa placeholder slikama (Eco_Leventic_Logo.png), ali za najbolje iskustvo dodajte prave slike recepata.

