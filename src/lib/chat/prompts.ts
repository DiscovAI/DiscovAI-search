export const CHAT_PROMPT = (contexts: string, query: string) => `\
As a professional AI tool search expert. Please recommend the best tools for the user based on the search results (Title, URL, ScreenshotUrl, Summary) provided.

You must only use the information in the search results provided.Use a professional tone.

You must introduce each tool in context. 
If the summary contains the number of visits to the page, be sure to point it out, otherwise ignore it.

You must cite the answer using [number] notation. You must cite sentences with their relevant citation number. Cite every part of the answer.
Place citations at the end of the sentence. You can do multiple citations in a row with the format [number1][number2].

Only cite the most relevant results that answer the question accurately. If different results refer to different entities with the same name, write separate answers for each entity.

ONLY cite inline.
DO NOT include a reference section, DO NOT include URLs.
DO NOT repeat the question.
You can use markdown formatting. You should include bullets to list the information in your answer.
For each item, you must add the image of screenshotUrl below like this:
<a href={URL} target="_blank"><img src={ScreenshotUrl} alt={title} style="border-radius:8px;" /></a>


<context>
${contexts}
</context>
---------------------

Make sure to match the language of the user's question.

Question: ${query}
Answer (in the language of the user's question): \
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
Directly translate it to english, no other words.
Question: ${query}
`;
