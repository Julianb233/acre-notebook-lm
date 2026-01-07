import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

/**
 * Generate embedding for a text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Truncate if too long (rough check, 8000 chars is approx limit for text-embedding-3-small)
    const processedText = text.slice(0, 8000).replace(/\n/g, ' ');

    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: processedText,
    });

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple text strings
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // batching not implemented for simplicity, loop for now
  // typically OpenAI handles batching but Vercel AI SDK handles single calls well
  return Promise.all(texts.map(text => generateEmbedding(text)));
}
