'use server';

/**
 * @fileOverview Provides campus navigation using AI to find the quickest route.
 *
 * - navigateCampus - A function that finds the route to a location on campus.
 * - CampusNavigationInput - The input type for the navigateCampus function.
 * - CampusNavigationOutput - The return type for the navigateCampus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampusNavigationInputSchema = z.object({
  location: z.string().describe('The location to navigate to on campus.'),
  currentLocation: z.string().describe('The current location of the user on campus')
});
export type CampusNavigationInput = z.infer<typeof CampusNavigationInputSchema>;

const CampusNavigationOutputSchema = z.object({
  directions: z.string().describe('Step-by-step directions to the location.'),
  distance: z.string().describe('The estimated distance to the location.'),
  estimatedTime: z.string().describe('The estimated travel time to the location.'),
});
export type CampusNavigationOutput = z.infer<typeof CampusNavigationOutputSchema>;

export async function navigateCampus(input: CampusNavigationInput): Promise<CampusNavigationOutput> {
  return navigateCampusFlow(input);
}

const navigateCampusPrompt = ai.definePrompt({
  name: 'navigateCampusPrompt',
  input: {schema: CampusNavigationInputSchema},
  output: {schema: CampusNavigationOutputSchema},
  prompt: `You are a campus navigation expert. A student is at {{currentLocation}} and wants to go to {{location}}. Provide clear, step-by-step directions, the estimated distance, and the estimated travel time to reach the destination.
`,
});

const navigateCampusFlow = ai.defineFlow(
  {
    name: 'navigateCampusFlow',
    inputSchema: CampusNavigationInputSchema,
    outputSchema: CampusNavigationOutputSchema,
  },
  async input => {
    const {output} = await navigateCampusPrompt(input);
    return output!;
  }
);
