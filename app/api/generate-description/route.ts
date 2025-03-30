import { openai } from "@/lib/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { description } = await req.json()
    if (!description) {
      return NextResponse.json({ error: "La description est requise" }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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
    })

    const cpmletionDescription = completion.choices[0].message.content?.trim()

    return NextResponse.json({ cpmletionDescription })
  } catch (error) {
    console.error("Erreur API OpenAI :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
