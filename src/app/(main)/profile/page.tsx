
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Pencil, Ticket, Utensils, BookCheck, Sparkles, Loader2 } from "lucide-react";
import { userProfileData, registeredEvents, recentOrders, userBookings } from "@/lib/data";
import { generatePersona } from './actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [persona, setPersona] = useState<{ title: string; description: string } | null>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState(false);
  const [profile, setProfile] = useState(userProfileData);

  const handleGeneratePersona = async () => {
    setIsLoadingPersona(true);
    setPersona(null);
    try {
      const result = await generatePersona();
      setPersona(result);
    } catch (error) {
      console.error("Failed to generate persona", error);
      // Optionally, show an error message to the user
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
        course: formData.get('course') as string,
        year: Number(formData.get('year') as string),
        cgpa: formData.get('cgpa') as string,
    }));
    // In a real app, you'd probably want to find a way to close the dialog.
    // document.getElementById('close-dialog')?.click(); // A bit of a hack, but works for this case.
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      {/* Profile Card */}
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
                <Badge variant="secondary">CGPA: {profile.cgpa}</Badge>
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
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input id="name" name="name" defaultValue={profile.name} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="studentId" className="text-right">
                                    Student ID
                                </Label>
                                <Input id="studentId" name="studentId" defaultValue={profile.studentId} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input id="email" name="email" defaultValue={profile.email} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="course" className="text-right">
                                    Course
                                </Label>
                                <Input id="course" name="course" defaultValue={profile.course} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="year" className="text-right">
                                    Year
                                </Label>
                                <Input id="year" name="year" type="number" defaultValue={profile.year} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cgpa" className="text-right">
                                    CGPA
                                </Label>
                                <Input id="cgpa" name="cgpa" defaultValue={profile.cgpa} className="col-span-3" />
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

      {/* AI Campus Persona */}
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
      
      {/* Activity Snapshot */}
      <Card>
          <CardHeader>
            <CardTitle>Activity Snapshot</CardTitle>
            <CardDescription>A quick look at your recent and upcoming activities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Registered Events */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Ticket className="h-5 w-5 text-primary" /> Registered Events</h3>
              <div className="space-y-2">
                {registeredEvents.map(event => (
                  <div key={event.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
            
            {/* Recent Canteen Orders */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Utensils className="h-5 w-5 text-primary" /> Recent Canteen Orders</h3>
               <div className="space-y-2">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <p className="font-medium">{order.name} (x{order.quantity})</p>
                    <p className="text-sm font-semibold">₹{order.price * order.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Active Bookings */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><BookCheck className="h-5 w-5 text-primary" /> Active Bookings</h3>
               <div className="space-y-2">
                {userBookings.map(booking => (
                  <div key={booking.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div>
                        <p className="font-medium">{booking.resourceName}</p>
                        <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                    </div>
                     <Badge>{booking.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
      </Card>
    </div>
  );
}


    