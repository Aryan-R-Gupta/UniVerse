
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getDirections, type NavigationState } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Route, Milestone, Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Finding path...' : 'Get Directions'}
    </Button>
  );
}

export function NavigationClient() {
  const initialState: NavigationState = { message: null, errors: null, result: null };
  const [state, dispatch] = useActionState(getDirections, initialState);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Campus Navigation</CardTitle>
          <CardDescription>Find the quickest route to any location on campus.</CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentLocation">Your Current Location</Label>
              <Input
                id="currentLocation"
                name="currentLocation"
                placeholder="e.g., Main Gate"
                required
              />
              {state.errors?.currentLocation && <p className="text-sm text-destructive">{state.errors.currentLocation[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Your Destination</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="e.g., Library"
                required
              />
               {state.errors?.destination && <p className="text-sm text-destructive">{state.errors.destination[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Route Information</h2>
        {useFormStatus().pending ? (
           <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
               <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : state.result ? (
          <Card className="bg-card">
            <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                    <Bot className="h-6 w-6"/>
                    <CardTitle>AI Generated Route</CardTitle>
                </div>
                <CardDescription>Here is the suggested path to your destination.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{state.result.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Milestone className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{state.result.distance}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                    <Route className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Directions</p>
                        <p className="font-semibold whitespace-pre-line">{state.result.directions}</p>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed h-full">
            <Route className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No route to display</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your locations to find a path.
            </p>
          </Card>
        )}
        {state.message && !state.errors && !state.result && <p className="text-sm text-destructive mt-4">{state.message}</p>}
      </div>
    </div>
  );
}
