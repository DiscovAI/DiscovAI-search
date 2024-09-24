# DoktorNaDohled

AI konverzační platforma zaměřená na zajišťování přístupu k relevantním informacím a odpovědím na otázky uživatelů v oblasti zdravotnictví.

## Živá ukázka

[DoktorNaDohled.cz](https://www.doktornadohled-digimedic.cz/) (použijte ji zdarma bez přihlášení nebo kreditní karty).

## Přehled

- [Funkce](#funkce)
- [Tech-Stack](#tech-stack)
- [Rychlý start](#rychlý-start)
- [Deploy](#deploy)

## Funkce

- **Vedení konverzace**: AI vede uživatele konverzací zaměřenou na jejich zdravotní potřeby.
- **Analýza kontextu**: Systém analyzuje kontext a požadavky uživatele pro poskytnutí relevantních informací.
- **Vyhledávání dat**: Na základě analýzy AI vyhledává odpovědi v integrovaných databázích poskytovatelů zdravotní péče.
- **Doporučení poskytovatelů**: AI poskytuje uživateli seznam vhodných poskytovatelů zdravotní péče spolu s kontaktními informacemi.
- **Personalizace**: Systém využívá uživatelský profil pro přizpůsobení doporučení.
- **Bezpečnost**: Implementováno základní zabezpečení včetně rate limitingu.

## Tech-Stack

- Rámec aplikace: [Next.js](https://nextjs.org/)
- Streamování textu: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- Model LLM: [GPT-4](https://openai.com/)
- Databáze: [Supabase](https://supabase.com/)
- Vektor: [Pgvector](https://github.com/pgvector/pgvector)
- Model vkládání: [Jina AI](https://jina.ai/embeddings)
- Cache Redis: [Upstash](https://upstash.com/)
- Knihovna komponent: [shadcn/ui](https://ui.shadcn.com/)
- Primitiva komponent bez hlavy: [Radix UI](https://www.radix-ui.com/)
- Stylování: [Tailwind CSS](https://tailwindcss.com/)

## Rychlý start

### 1. Klonování repozitáře

```
git clone https://github.com/DigiMedic/Doktor-Na-Dohled
```

### 2. Instalace závislostí

```
cd Doktor-Na-Dohled
pnpm i
```

### 3. Nastavení databáze Supabase

Vytvořte Supabase projekt a spusťte `src/db/init.sql` v SQL Editoru pro nastavení databáze.

### 4. Nastavení proměnných prostředí

Zkopírujte `.env.local.example` do `.env.local` a vyplňte všechny potřebné proměnné.

### 5. Spuštění aplikace

```
pnpm dev
```

Aplikace bude dostupná na `http://localhost:3000`.

## Deploy

Pro nasazení aplikace na Vercel postupujte podle [dokumentace Vercel](https://vercel.com/docs).