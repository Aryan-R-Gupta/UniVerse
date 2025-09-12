
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitFeedback, type FeedbackState } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Feedback'}
    </Button>
  );
}

export default function FeedbackPage() {
  const initialState: FeedbackState = { message: null, errors: null };
  const [state, dispatch] = useFormState(submitFeedback, initialState);
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
        <h1 className="text-3xl font-bold">Submit Feedback</h1>
        <p className="text-muted-foreground">We'd love to hear your thoughts or suggestions.</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Feedback</CardTitle>
          <CardDescription>Let us know how we can improve the app.</CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder="Tell us what you think..."
                required
                rows={5}
              />
              {state.errors?.feedback && <p className="text-sm text-destructive">{state.errors.feedback[0]}</p>}
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
