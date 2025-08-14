
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateImageSchema = z.object({
  prompt: z.string().describe('The prompt for the image generation.'),
});

export async function generateImage(prompt: string): Promise<string> {
  const {media} = await ai.generate({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: `A high-quality, vibrant, detailed image of: ${prompt}`,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });
  
  if (!media?.url) {
      throw new Error("Image generation failed to return a URL.");
  }

  return media.url;
}
