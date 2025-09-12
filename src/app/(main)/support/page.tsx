
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitSupportTicket, type SupportState } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Ticket'}
    </Button>
  );
}

export default function SupportPage() {
  const initialState: SupportState = { message: null, errors: null };
  const [state, dispatch] = useActionState(submitSupportTicket, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      } else {
        toast({
          title: 'Success',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold">Contact Support</h1>
        <p className="text-muted-foreground">Need help? Fill out the form below and we'll get back to you.</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Support Ticket</CardTitle>
          <CardDescription>Describe the issue you're facing in detail.</CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g., Issue with event registration"
                required
              />
              {state.errors?.subject && <p className="text-sm text-destructive">{state.errors.subject[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Please describe the problem you are encountering..."
                required
                rows={6}
              />
              {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
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
