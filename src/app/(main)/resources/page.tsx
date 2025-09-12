
'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resources as allResources, type NavItem } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { bookResource, type BookingState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Resource = {
  id: number;
  name: string;
  location: string;
  available: boolean;
  icon: NavItem['icon'];
};

type Availability = {
  [resourceId: string]: string[]; // Array of booked time slots
};

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

async function getAvailability(): Promise<Availability> {
    const db = getFirestore(app);
    const bookingsCol = collection(db, 'resource-bookings');
    // For simplicity, we fetch all of today's bookings. In a real app, you'd filter by date.
    const bookingsSnapshot = await getDocs(bookingsCol);

    const availability: Availability = {};

    bookingsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const { resourceId, timeSlot } = data;
        if (resourceId && timeSlot) {
            if (!availability[resourceId]) {
                availability[resourceId] = [];
            }
            availability[resourceId].push(timeSlot);
        }
    });

    return availability;
}


function BookingSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Confirming...' : 'Confirm Booking'}
    </Button>
  );
}

function ResourceCard({ resource, availability, onBookClick }: { resource: Resource, availability: string[], onBookClick: () => void }) {
    const totalSlots = timeSlots.length;
    const bookedSlots = availability.length;
    const isFullyBooked = bookedSlots === totalSlots;

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{resource.name}</CardTitle>
                <CardDescription>{resource.location}</CardDescription>
              </div>
               <Badge variant={isFullyBooked ? "destructive" : "default"} className={!isFullyBooked ? "bg-emerald-600" : ""}>
                {isFullyBooked ? "Fully Booked" : "Available"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <resource.icon className="h-4 w-4" />
                <span>{resource.name.split(' ')[0]}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{bookedSlots} of {totalSlots} slots booked today.</p>
            </CardContent>
            <CardFooter>
                <Button onClick={onBookClick} disabled={isFullyBooked} className="w-full">
                    Book Slot
                </Button>
            </CardFooter>
          </Card>
    )
}

export default function ResourcesPage() {
  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const initialState: BookingState = { message: null, errors: null };
  const [state, dispatch] = useActionState(bookResource, initialState);

  useEffect(() => {
    async function fetchAvailability() {
        setLoading(true);
        try {
            const av = await getAvailability();
            setAvailability(av);
        } catch (error) {
            console.error("Failed to fetch resource availability:", error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Could not load resource availability.",
            });
        } finally {
            setLoading(false);
        }
    }
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description: state.errors.general?.[0] || state.message,
        });
      } else {
        toast({
          title: 'Success!',
          description: state.message,
        });
        // Refetch availability and close dialog
        getAvailability().then(setAvailability);
        dialogCloseRef.current?.click();
      }
      formRef.current?.reset();
    }
  }, [state, toast]);

  const handleBookClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Booking</h1>
        <p className="text-muted-foreground">Book study rooms, labs, and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({length: 4}).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-1/3 mt-2" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-1/2" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))
        ) : (
            allResources.map(resource => (
                <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    availability={availability[resource.id.toString()] || []}
                    onBookClick={() => handleBookClick(resource)}
                />
            ))
        )}
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                {selectedResource && (
                    <>
                    <DialogHeader>
                        <DialogTitle>Book {selectedResource.name}</DialogTitle>
                        <DialogDescription>Select an available time slot to confirm your booking.</DialogDescription>
                    </DialogHeader>
                    <form action={dispatch} ref={formRef}>
                         <div className="py-4">
                            <RadioGroup name="timeSlot" required>
                                {timeSlots.map(slot => {
                                    const isBooked = (availability[selectedResource.id.toString()] || []).includes(slot);
                                    return (
                                        <div key={slot} className="flex items-center space-x-2">
                                            <RadioGroupItem value={slot} id={`slot-${slot}`} disabled={isBooked} />
                                            <Label htmlFor={`slot-${slot}`} className={cn(isBooked && "text-muted-foreground line-through")}>
                                                {slot} {isBooked && "(Booked)"}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                            {state.errors?.timeSlot && <p className="text-sm text-destructive mt-2">{state.errors.timeSlot[0]}</p>}
                            {state.errors?.general && <p className="text-sm text-destructive mt-2">{state.errors.general[0]}</p>}
                         </div>
                        <input type="hidden" name="resourceId" value={selectedResource.id} />
                        <input type="hidden" name="resourceName" value={selectedResource.name} />
                        <DialogFooter>
                            <BookingSubmitButton />
                        </DialogFooter>
                    </form>
                    </>
                )}
                 <DialogClose ref={dialogCloseRef} />
            </DialogContent>
        </Dialog>

    </div>
  );
}
