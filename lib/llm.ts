/**
 * LLM abstraction layer.
 *
 * Backend: Ollama running locally (or in Docker) via its OpenAI-compatible endpoint.
 *   - Model: configurable via OLLAMA_MODEL env var (default: qwen2.5:7b)
 *   - Endpoint: OLLAMA_HOST env var (required — set in docker-compose or .env.local)
 */

import * as nodeHttp from "node:http";
import * as nodeHttps from "node:https";

export interface LLMClient {
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

/**
 * Returns a configured Ollama LLM client.
 * Throws if OLLAMA_HOST is not set — the app requires Ollama to function.
 *
 * Do not cache this at module load time — Next.js hot-reload and edge workers
 * may have different env vars. The selection is cheap (no network call).
 */
export function getLLMClient(): LLMClient {
  const host = process.env.OLLAMA_HOST;

  if (!host) {
    throw new Error(
      "OLLAMA_HOST is not set. Add it to .env.local (e.g. OLLAMA_HOST=http://localhost:11434) " +
      "or ensure the docker-compose environment block is correct."
    );
  }

  console.log(`[llm] Using Ollama at ${host}`);
  return buildOllamaClient(host);
}

function buildOllamaClient(host: string): LLMClient {
  const baseURL = `${host}/v1`;

  // Timeout is configurable via OLLAMA_TIMEOUT_MS env var.
  // Default is 9 minutes — CPU inference varies widely by hardware.
  // Set to 0 to wait indefinitely.
  const timeoutMs = parseInt(process.env.OLLAMA_TIMEOUT_MS ?? "540000", 10);

  const create = async (params: ChatCompletionParams): Promise<ChatCompletionResult> => {
    // Use Node.js http/https directly instead of fetch so we avoid undici's
    // built-in headersTimeout (300s default) which kills long CPU inference
    // requests before Ollama sends its first response byte.
    const { request: nodeRequest } = baseURL.startsWith("https") ? nodeHttps : nodeHttp;

    return new Promise((resolve, reject) => {
      const body = JSON.stringify(params);
      const url = new URL(`${baseURL}/chat/completions`);

      const req = nodeRequest(
        {
          hostname: url.hostname,
          port: url.port || (url.protocol === "https:" ? 443 : 80),
          path: url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => {
            const text = Buffer.concat(chunks).toString("utf8");
            if ((res.statusCode ?? 0) >= 400) {
              reject(new Error(`Ollama request failed (${res.statusCode}): ${text}`));
              return;
            }
            try {
              resolve(JSON.parse(text) as ChatCompletionResult);
            } catch {
              reject(new Error(`Ollama returned non-JSON response: ${text.slice(0, 200)}`));
            }
          });
        }
      );

      req.on("error", reject);

      if (timeoutMs > 0) {
        req.setTimeout(timeoutMs, () => {
          req.destroy(new Error(`Ollama request timed out after ${timeoutMs}ms`));
        });
      }

      req.write(body);
      req.end();
    });
  };

  return {
    baseURL,
    model: process.env.OLLAMA_MODEL ?? "qwen2.5:7b",
    chat: { completions: { create } },
  };
}
