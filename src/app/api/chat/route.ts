import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "No message found." },
        { status: 400 }
      );
    }

    const fullInput = `
${SYSTEM_PROMPT}
ব্যবহারকারীর প্রশ্ন: ${message}
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: fullInput,
    });

    const reply = interaction.output_text ?? "I'm sorry, I couldn't provide an answer.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}