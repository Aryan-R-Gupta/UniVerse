
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { events } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerForEvent, type RegistrationState } from './actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={pending}>
      {pending ? 'Confirming...' : 'Confirm Registration'}
    </Button>
  );
}

export default function EventRegistrationPage({ params }: { params: { slug: string } }) {
  const event = events.find(e => e.slug === params.slug);
  const { toast } = useToast();
  const router = useRouter();

  const initialState: RegistrationState = { message: null, errors: null, registrationId: null };
  const registerWithSlug = registerForEvent.bind(null, params.slug);
  const [state, dispatch] = useActionState(registerWithSlug, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.errors || !state.registrationId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      } else {
        toast({
          title: 'Success!',
          description: state.message,
        });
        router.push(`/events/ticket/${state.registrationId}`);
      }
    }
  }, [state, toast, router]);


  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Register for {event.title}</h1>
        <p className="text-muted-foreground">Fill out the form below to secure your spot.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>Event: {event.title}</CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="Payal" required />
                    {state.errors?.firstName && <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Soni" required />
                    {state.errors?.lastName && <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>}
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="kanksha@university.edu" required />
              {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" name="studentId" placeholder="12345" required />
              {state.errors?.studentId && <p className="text-sm text-destructive">{state.errors.studentId[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
