/**
 * LLM abstraction layer.
 *
 * Primary: Ollama running locally via its OpenAI-compatible endpoint.
 *   - Model: qwen2.5:14b (~8.7GB at Q4_K_M — fits 16GB RAM, CPU-only)
 *   - Endpoint: http://localhost:11434/v1 (or OLLAMA_HOST env var)
 *
 * Fallback: Groq (cloud, free tier, llama-3.1-8b-instant)
 *   - Used when OLLAMA_HOST is not set in the environment.
 *   - Useful for fast development without running Docker locally.
 *
 * Callers receive a plain OpenAI-compatible client and never need to know
 * which backend is active. The active backend is logged at startup.
 */

import Groq from "groq-sdk";

export type LLMBackend = "ollama" | "groq";

export interface LLMClient {
  backend: LLMBackend;
  baseURL: string;
  /** The exact model string to pass to chat.completions.create() */
  model: string;
  chat: {
    completions: {
      create: (params: ChatCompletionParams) => Promise<ChatCompletionResult>;
    };
  };
}

interface ChatCompletionParams {
  model: string;
  temperature: number;
  max_tokens: number;
  response_format?: { type: "json_object" };
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}

interface ChatCompletionResult {
  choices: Array<{
    message: { content: string | null };
  }>;
}

function buildOllamaClient(host: string): LLMClient {
  const baseURL = `${host}/v1`;

  // Ollama's OpenAI-compatible endpoint accepts fetch-based calls.
  // We implement the minimal interface rather than importing the full openai package.
  const create = async (params: ChatCompletionParams): Promise<ChatCompletionResult> => {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      // CPU inference on qwen2.5:14b can take 60–120s — allow enough time.
      signal: AbortSignal.timeout(180_000),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama request failed (${response.status}): ${text}`);
    }

    return response.json() as Promise<ChatCompletionResult>;
  };

  return {
    backend: "ollama",
    baseURL,
    model: "qwen2.5:14b",
    chat: { completions: { create } },
  };
}

function buildGroqClient(): LLMClient {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const model = "llama-3.1-8b-instant";

  const create = async (params: ChatCompletionParams): Promise<ChatCompletionResult> => {
    // Groq SDK's create() is overloaded — passing stream:false narrows the return
    // type to ChatCompletion (non-streaming), which has a .choices array.
    const result = await groq.chat.completions.create({
      ...params,
      model,
      stream: false,
    });

    return {
      choices: result.choices.map((c: { message: { content: string | null } }) => ({
        message: { content: c.message.content ?? null },
      })),
    };
  };

  return {
    backend: "groq",
    baseURL: "https://api.groq.com/openai/v1",
    model,
    chat: { completions: { create } },
  };
}

/**
 * Returns a configured LLM client. The backend is selected once per process
 * based on the OLLAMA_HOST environment variable.
 *
 * Do not cache this at module load time — Next.js hot-reload and edge workers
 * may have different env vars. The selection is cheap (no network call).
 */
export function getLLMClient(): LLMClient {
  const ollamaHost = process.env.OLLAMA_HOST;

  if (ollamaHost) {
    console.log(`[llm] Using Ollama backend at ${ollamaHost}`);
    return buildOllamaClient(ollamaHost);
  }

  console.log("[llm] OLLAMA_HOST not set — falling back to Groq");
  return buildGroqClient();
}
