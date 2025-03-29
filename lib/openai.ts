import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function generateProjectDescription(description: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en gestion de projet. Tu dois analyser la description d'un projet et générer une description plus détaillée et structurée."
        },
        {
          role: "user",
          content: `Analyse cette description de projet et génère une version plus détaillée et structurée : ${description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || description;
  } catch (error) {
    console.error('Erreur lors de la génération de la description :', error);
    return description;
  }
}