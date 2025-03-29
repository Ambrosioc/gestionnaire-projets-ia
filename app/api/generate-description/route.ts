// src/app/api/generate-description/route.ts
import { openai } from "@/lib/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { projectName } = await req.json()

    if (!projectName) {
      return NextResponse.json({ error: "Nom du projet manquant." }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Rédige une courte description professionnelle d’un projet freelance intitulé : "${projectName}". Sois concis et clair.`,
        },
      ],
    })

    const description = completion.choices[0].message.content?.trim()

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Erreur API OpenAI :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
