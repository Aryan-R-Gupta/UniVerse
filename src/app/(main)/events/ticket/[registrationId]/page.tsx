
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { Ticket, Calendar, User, Hash } from 'lucide-react';

type RegistrationDetails = {
  id: string;
  eventTitle: string;
  firstName: string;
  lastName: string;
  studentId: string;
  registeredAt: Date;
};

async function getRegistrationDetails(id: string): Promise<RegistrationDetails | null> {
  const db = getFirestore(app);
  const docRef = doc(db, 'event-registrations', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      eventTitle: data.eventTitle,
      firstName: data.firstName,
      lastName: data.lastName,
      studentId: data.studentId,
      registeredAt: (data.registeredAt as Timestamp).toDate(),
    };
  }
  return null;
}

export default function TicketPage({ params }: { params: { registrationId: string } }) {
  const [details, setDetails] = useState<RegistrationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getRegistrationDetails(params.registrationId);
        if (data) {
          setDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch registration details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [params.registrationId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Skeleton className="h-40 w-40" />
            <div className="w-full space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!details) {
    return notFound();
  }

  const qrValue = JSON.stringify({
    registrationId: details.id,
    name: `${details.firstName} ${details.lastName}`,
    event: details.eventTitle,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Event Ticket</h1>
        <p className="text-muted-foreground">Present this QR code at the event for check-in.</p>
      </div>

      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-muted/50 text-center rounded-t-lg p-4">
          <div className="flex items-center justify-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{details.eventTitle}</CardTitle>
          </div>
          <CardDescription>Registration Confirmed</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <QRCode value={qrValue} size={160} />
          </div>
          <div className="w-full text-left space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{details.firstName} {details.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{details.studentId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Registered On</p>
                <p className="font-medium">{format(details.registeredAt, 'PPP p')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
