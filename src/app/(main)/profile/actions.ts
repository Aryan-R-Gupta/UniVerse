
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { registeredEvents, recentOrders, userBookings, userProfileData } from '@/lib/data';

const PersonaOutputSchema = z.object({
  title: z.string().describe("A creative, single-word title for the user's campus persona (e.g., 'Innovator', 'Explorer')."),
  description: z.string().describe("A short, engaging one-sentence description of this persona, highlighting their key traits based on their activity."),
});

type PersonaOutput = z.infer<typeof PersonaOutputSchema>;

const personaPrompt = ai.definePrompt({
  name: 'personaPrompt',
  output: { schema: PersonaOutputSchema },
  prompt: `You are a fun, creative AI that analyzes a student's campus activity to assign them a "Campus Persona".

Analyze the following user data:
- Name: {{name}}
- Course: {{course}}
- Registered Events: {{events}}
- Canteen Orders: {{orders}}
- Resource Bookings: {{bookings}}

Based on this data, generate a creative, one-word persona title and a short, engaging one-sentence description. For example, if a user attends tech workshops and orders coffee, their persona could be "The Innovator" with a description like "Fueled by caffeine and code, this student is always building the next big thing." If they attend cultural fests and book study rooms, they could be "The Scholar" who "Balances academic pursuits with a rich cultural life."

Generate a persona for the user.`,
});

export async function generatePersona(): Promise<PersonaOutput> {
  const eventsSummary = registeredEvents.map(e => e.title).join(', ');
  const ordersSummary = recentOrders.map(o => o.name).join(', ');
  const bookingsSummary = userBookings.map(b => b.resourceName).join(', ');

  const { output } = await personaPrompt({
    name: userProfileData.name,
    course: userProfileData.course,
    events: eventsSummary,
    orders: ordersSummary,
    bookings: bookingsSummary,
  });

  return output!;
}

    