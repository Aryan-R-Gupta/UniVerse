
import { events } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EventRegistrationPage({ params }: { params: { slug: string } }) {
  const event = events.find(e => e.slug === params.slug);

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
        <form>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="Payal" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Soni" required />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="payal@example.com" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" name="studentId" placeholder="12345" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Confirm Registration
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Generate static paths for each event
export async function generateStaticParams() {
  return events.map(event => ({
    slug: event.slug,
  }));
}

    