
'use server';
 
import { redirect } from 'next/navigation';
import { z } from 'zod';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  if (validatedFields.success) {
      const { username, password } = validatedFields.data;
    // For demonstration, using simple hardcoded credentials
    if (username === 'user' && password === 'password') {
      // In a real app, you'd set a session cookie here
      redirect('/dashboard');
    }
  }
 
  return 'Invalid credentials. Please try again.';
}
