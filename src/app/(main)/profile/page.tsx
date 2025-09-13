
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Pencil, Ticket, Utensils, BookCheck, Sparkles, Loader2 } from "lucide-react";
import { userProfileData } from "@/lib/data";
import { generatePersona } from './actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFirestore, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type RegisteredEvent = {
  id: string;
  title: string;
  date: string;
  category: string;
  registeredAt: Date;
};

type RecentOrder = {
  id: string;
  items: { name: string; quantity: number, price: number }[];
  totalPrice: number;
};

type UserBooking = {
  id: string;
  resourceName: string;
  timeSlot: string;
  status: string;
};

async function getUserActivity(userEmail: string) {
  const db = getFirestore(app);
  
  // Fetch Registered Events
  const eventsQuery = query(
    collection(db, 'event-registrations'), 
    where('email', '==', userEmail),
    // orderBy('registeredAt', 'desc'), // This requires a composite index. We will sort in-memory instead.
    limit(5) // Fetch a bit more to sort from
  );
  const eventsSnapshot = await getDocs(eventsQuery);
  const registeredEvents: RegisteredEvent[] = eventsSnapshot.docs.map(doc => {
    const data = doc.data();
    const registeredAt = (data.registeredAt as Timestamp).toDate();
    return {
      id: doc.id,
      title: data.eventTitle,
      date: format(registeredAt, 'MMM d'),
      category: data.eventCategory,
      registeredAt: registeredAt, // Keep the date object for sorting
    }
  });

  // Sort events by date descending and take the latest 2
  const sortedEvents = registeredEvents.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime()).slice(0, 2);


  // Fetch Recent Orders
  const ordersQuery = query(
    collection(db, 'canteen-orders'),
    where('userEmail', '==', userEmail),
    orderBy('createdAt', 'desc'),
    limit(2)
  );
  const ordersSnapshot = await getDocs(ordersQuery);
  const recentOrders: RecentOrder[] = ordersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as RecentOrder));


  // Fetch Active Bookings
  const bookingsQuery = query(
    collection(db, 'resource-bookings'),
    where('userEmail', '==', userEmail),
    orderBy('bookedAt', 'desc'),
    limit(2)
  );
  const bookingsSnapshot = await getDocs(bookingsQuery);
  const userBookings: UserBooking[] = bookingsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as UserBooking));

  return { registeredEvents: sortedEvents, recentOrders, userBookings };
}


export default function ProfilePage() {
  const [persona, setPersona] = useState<{ title: string; description: string } | null>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState(false);
  const [profile, setProfile] = useState(userProfileData);
  const [activity, setActivity] = useState<{
    registeredEvents: RegisteredEvent[];
    recentOrders: RecentOrder[];
    userBookings: UserBooking[];
  }>({ registeredEvents: [], recentOrders: [], userBookings: [] });
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  useEffect(() => {
    async function loadActivity() {
        setIsLoadingActivity(true);
        try {
            const userActivity = await getUserActivity(profile.email);
            setActivity(userActivity);
        } catch (error) {
            console.error("Failed to fetch user activity", error);
        } finally {
            setIsLoadingActivity(false);
        }
    }
    loadActivity();
  }, [profile.email]);

  const handleGeneratePersona = async () => {
    setIsLoadingPersona(true);
    setPersona(null);
    try {
      const result = await generatePersona();
      setPersona(result);
    } catch (error) {
      console.error("Failed to generate persona", error);
    } finally {
      setIsLoadingPersona(false);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setProfile(prev => ({
        ...prev,
        name: formData.get('name') as string,
        studentId: formData.get('studentId') as string,
        email: formData.get('email') as string,
        course: formData.get('course') as string,
        year: Number(formData.get('year') as string),
    }));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription>Student ID: {profile.studentId}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{profile.course}</Badge>
                <Badge variant="secondary">Year {profile.year}</Badge>
              </div>
            </div>
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Profile</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" defaultValue={profile.name} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="studentId" className="text-right">Student ID</Label>
                                <Input id="studentId" name="studentId" defaultValue={profile.studentId} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={profile.email} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="course" className="text-right">Course</Label>
                                <Input id="course" name="course" defaultValue={profile.course} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="year" className="text-right">Year</Label>
                                <Input id="year" name="year" type="number" defaultValue={profile.year} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="submit">Save changes</Button>
                          </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-accent" />
            AI Campus Persona
          </CardTitle>
          <CardDescription>Discover your unique campus identity based on your activities.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPersona ? (
             <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : persona ? (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-bold text-lg text-primary">{persona.title}</h3>
              <p className="text-sm text-muted-foreground">{persona.description}</p>
            </div>
          ) : (
             <p className="text-sm text-muted-foreground">Click the button to generate your persona!</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGeneratePersona} disabled={isLoadingPersona}>
             {isLoadingPersona ? 'Generating...' : 'Generate My Persona'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle>Activity Snapshot</CardTitle>
            <CardDescription>A quick look at your recent and upcoming activities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Ticket className="h-5 w-5 text-primary" /> Registered Events</h3>
              {isLoadingActivity ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              ) : activity.registeredEvents.length > 0 ? (
                <div className="space-y-2">
                    {activity.registeredEvents.map(event => (
                    <div key={event.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                        <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                        <Badge variant="outline">{event.category}</Badge>
                    </div>
                    ))}
                </div>
              ) : <p className="text-sm text-muted-foreground p-2">No registered events.</p>}
            </div>

            <Separator />
            
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Utensils className="h-5 w-5 text-primary" /> Recent Canteen Orders</h3>
               {isLoadingActivity ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              ) : activity.recentOrders.length > 0 ? (
                <div className="space-y-2">
                    {activity.recentOrders.map(order => (
                        <div key={order.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                            <div>
                                {order.items.map(item => <p key={item.name} className="font-medium">{item.name} (x{item.quantity})</p>)}
                            </div>
                            <p className="text-sm font-semibold">₹{order.totalPrice}</p>
                        </div>
                    ))}
                </div>
              ): <p className="text-sm text-muted-foreground p-2">No recent orders.</p>}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><BookCheck className="h-5 w-5 text-primary" /> Active Bookings</h3>
               {isLoadingActivity ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              ) : activity.userBookings.length > 0 ? (
                <div className="space-y-2">
                    {activity.userBookings.map(booking => (
                    <div key={booking.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                        <div>
                            <p className="font-medium">{booking.resourceName}</p>
                            <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                        </div>
                        <Badge>{booking.status}</Badge>
                    </div>
                    ))}
                </div>
              ): <p className="text-sm text-muted-foreground p-2">No active bookings.</p>}
            </div>
          </CardContent>
      </Card>
    </div>
  );
}

    
