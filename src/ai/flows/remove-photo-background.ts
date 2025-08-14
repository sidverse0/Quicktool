'use server';

/**
 * @fileOverview Removes the background from an image using AI.
 *
 * - removePhotoBackground - A function that handles removing the background from a photo.
 * - RemovePhotoBackgroundInput - The input type for the removePhotoBackground function.
 * - RemovePhotoBackgroundOutput - The return type for the removePhotoBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemovePhotoBackgroundInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to remove the background from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'  
    ),
});
export type RemovePhotoBackgroundInput = z.infer<typeof RemovePhotoBackgroundInputSchema>;

const RemovePhotoBackgroundOutputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo with the background removed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type RemovePhotoBackgroundOutput = z.infer<typeof RemovePhotoBackgroundOutputSchema>;

export async function removePhotoBackground(input: RemovePhotoBackgroundInput): Promise<RemovePhotoBackgroundOutput> {
  return removePhotoBackgroundFlow(input);
}

const prompt = ai.definePrompt({
  name: 'removePhotoBackgroundPrompt',
  input: {schema: RemovePhotoBackgroundInputSchema},
  output: {schema: RemovePhotoBackgroundOutputSchema},
  prompt: `Remove the background from this photo and return the image as a data URI. Be sure to preserve the subject of the photo. Only return the data URI, do not include any other text. 

{{media url=photoDataUri}}`,
});

const removePhotoBackgroundFlow = ai.defineFlow(
  {
    name: 'removePhotoBackgroundFlow',
    inputSchema: RemovePhotoBackgroundInputSchema,
    outputSchema: RemovePhotoBackgroundOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return { photoDataUri: output!.photoDataUri };
  }
);
