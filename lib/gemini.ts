// Renamed to groq.ts conceptually but kept as gemini.ts to avoid import updates.
// Model in use: llama-3.3-70b-versatile via Groq (free tier, no credit card)
// Get a free key at console.groq.com

import Groq from "groq-sdk";

let _client: Groq | null = null;

export function getGeminiClient(): Groq {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not set. Add it to .env.local — get a free key at console.groq.com"
      );
    }
    _client = new Groq({ apiKey });
  }
  return _client;
}
