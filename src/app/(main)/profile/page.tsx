
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

export default function ProfilePage() {
  const [persona, setPersona] = useState<{ title: string; description: string } | null>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState(false);

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


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={userProfileData.avatarUrl} alt={userProfileData.name} />
              <AvatarFallback>{userProfileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{userProfileData.name}</CardTitle>
              <CardDescription>Student ID: {userProfileData.studentId}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">{userProfileData.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{userProfileData.major}</Badge>
                <Badge variant="secondary">Year {userProfileData.year}</Badge>
                <Badge variant="secondary">GPA: {userProfileData.gpa}</Badge>
              </div>
            </div>
            <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Profile</span>
            </Button>
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
