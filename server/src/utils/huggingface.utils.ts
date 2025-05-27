import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function getTextEmbedding(text: string): Promise<number[]> {
  const response = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
  });

  if (!Array.isArray(response)) {
    throw new Error("Embedding response is not valid");
  }

  return response as number[];
}
