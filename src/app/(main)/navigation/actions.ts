'use server';

import { z } from 'zod';
import { navigateCampus, type CampusNavigationInput, type CampusNavigationOutput } from '@/ai/flows/campus-navigation-tool';

const NavigationSchema = z.object({
  currentLocation: z.string().min(3, { message: 'Current location must be at least 3 characters long.' }),
  destination: z.string().min(3, { message: 'Destination must be at least 3 characters long.' }),
});

export type NavigationState = {
    message?: string | null;
    result?: CampusNavigationOutput | null;
    errors?: {
        currentLocation?: string[];
        destination?: string[];
    } | null;
}

export async function getDirections(prevState: NavigationState, formData: FormData): Promise<NavigationState> {
  const validatedFields = NavigationSchema.safeParse({
    currentLocation: formData.get('currentLocation'),
    destination: formData.get('destination'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
    };
  }

  const { currentLocation, destination } = validatedFields.data;

  try {
    const input: CampusNavigationInput = {
      location: destination,
      currentLocation: currentLocation,
    };
    
    const result = await navigateCampus(input);

    return {
      message: 'Route found successfully.',
      result: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to get directions. Please try again.',
      result: null,
    };
  }
}
