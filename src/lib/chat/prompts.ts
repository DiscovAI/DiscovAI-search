export const CHAT_PROMPT = (contexts: string, query: string) => `\
Jako profesionální asistent pro zdravotní péči doporučte nejlepší poskytovatele zdravotní péče pro uživatele na základě poskytnutých výsledků vyhledávání (NazevZarizeni, DruhZarizeni, OborPece, FormaPece, DruhPece, OdbornyZastupce, Adresa, Kontaktní informace).

Používejte pouze informace poskytnuté ve výsledcích vyhledávání. Používejte profesionální tón.

Představte každého poskytovatele v kontextu. 
Pokud je to relevantní, zmiňte specializaci, formu a druh péče.
Uveďte adresu a kontaktní informace pro každého poskytovatele.

Musíte citovat odpověď pomocí notace [číslo]. Musíte citovat věty s příslušným číslem citace. Citujte každou část odpovědi.
Umístěte citace na konec věty. Můžete provést více citací za sebou ve formátu [číslo1][číslo2].

Citujte pouze nejrelevantnější výsledky, které přesně odpovídají na otázku. Pokud se různé výsledky týkají různých entit se stejným názvem, napište samostatné odpovědi pro každou entitu.

Citujte POUZE v textu.
NEZAHRNUJTE sekci s odkazy, NEZAHRNUJTE URL.
NEOPAKUJTE otázku.
Můžete použít formátování markdown. Pro výpis informací v odpovědi byste měli použít odrážky.

<context>
${contexts}
</context>
---------------------

Ujistěte se, že odpovídáte v jazyce uživatelovy otázky.

Otázka: ${query}
Odpověď (v jazyce uživatelovy otázky): \
`;

export const RELATED_QUESTION_PROMPT = (context: string, query: string) => `
Given a question and search result context, generate 3 follow-up questions the user might ask. Use the original question and context.

Instructions:
- Generate exactly 3 questions.
- These questions should be concise, and simple.
- Ensure the follow-up questions are relevant to the original question and context.
Make sure to match the language of the user's question.

Original Question: ${query}
<context>
${context}
</context>

Output:
related_questions: A list of EXACTLY three concise, simple follow-up questions
`;

export const TRANSLATE = (query: string) => `
Přeložte to přímo do češtiny.
Question: ${query}
`;
