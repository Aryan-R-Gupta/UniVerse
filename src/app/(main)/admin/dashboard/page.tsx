
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, MessageSquare, HelpCircle, Megaphone, CalendarPlus, BarChart2, BookOpen, Utensils, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getFirestore, collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useActionState, useRef, useState } from "react";
import { publishAlert, type PublishAlertState } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";


type Feedback = {
  id: string;
  text: string;
  submittedAt: string;
};

type SupportTicket = {
  id: string;
  subject: string;
  user: string;
  status: string;
  createdAt: string;
};

async function getFeedback(): Promise<Feedback[]> {
  const db = getFirestore(app);
  const feedbackCol = collection(db, 'feedback');
  const q = query(feedbackCol, orderBy('createdAt', 'desc'), limit(5));
  const feedbackSnapshot = await getDocs(q);
  const feedbackList = feedbackSnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt as Timestamp;
    return {
      id: doc.id,
      text: data.text,
      submittedAt: createdAt ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true }) : 'Just now',
    };
  });
  return feedbackList;
}

async function getSupportTickets(): Promise<SupportTicket[]> {
  const db = getFirestore(app);
  const ticketsCol = collection(db, 'support-tickets');
  const q = query(ticketsCol, orderBy('createdAt', 'desc'), limit(5));
  const ticketsSnapshot = await getDocs(q);
  const ticketsList = ticketsSnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt as Timestamp;
    return {
      id: doc.id,
      subject: data.subject,
      user: data.userEmail, // Assuming the field is userEmail in Firestore
      status: data.status,
      createdAt: createdAt ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true }) : 'Just now',
    };
  });
  return ticketsList;
}

function PublishAlertButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Alert'}
        </Button>
    )
}


export default function AdminDashboardPage() {
  const [latestFeedback, setLatestFeedback] = useState<Feedback[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const initialState: PublishAlertState = { message: null, errors: null };
  const [state, dispatch] = useActionState(publishAlert, initialState);

  useEffect(() => {
    async function fetchData() {
        const [feedbackData, ticketsData] = await Promise.all([getFeedback(), getSupportTickets()]);
        setLatestFeedback(feedbackData);
        setSupportTickets(ticketsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      } else {
        toast({ title: 'Success', description: state.message });
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Administrator Overview</h1>

      {/* Analytics Quick Links */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Live Campus Analytics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Utensils /> Canteen Analytics</CardTitle>
              <CardDescription>View sales trends, popular items, and peak ordering times.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/canteen-analytics">View Canteen Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen /> Resource Analytics</CardTitle>
              <CardDescription>Track booking rates, popular resources, and utilization.</CardDescription>
            </CardHeader>
            <CardFooter>
               <Button asChild className="w-full">
                <Link href="/admin/resource-analytics">View Resource Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart2 /> Event Analytics</CardTitle>
              <CardDescription>Analyze event popularity, registration trends, and attendance.</CardDescription>
            </CardHeader>
             <CardFooter>
               <Button asChild className="w-full">
                <Link href="/admin/event-analytics">View Event Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Feedback & Support Hub */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare /> Feedback Hub</CardTitle>
                <CardDescription>Latest user feedback</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Feedback</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {latestFeedback.length > 0 ? latestFeedback.map(fb => (
                            <TableRow key={fb.id}>
                                <TableCell className="truncate max-w-xs">{fb.text}</TableCell>
                                <TableCell className="text-right">{fb.submittedAt}</TableCell>
                            </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center">No feedback yet.</TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                  <Link href="/admin/feedback-hub">View All Feedback</Link>
              </Button>
            </CardFooter>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><HelpCircle /> Support Tickets</CardTitle>
                <CardDescription>Active and recent tickets</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">User</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {supportTickets.map(ticket => (
                            <TableRow key={ticket.id}>
                                <TableCell className="font-medium truncate max-w-40">{ticket.subject}</TableCell>
                                <TableCell><Badge variant={ticket.status === 'open' ? 'destructive' : 'default'}>{ticket.status}</Badge></TableCell>
                                <TableCell className="text-right">{ticket.user}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                  <Link href="/admin/support-tickets">View All Tickets</Link>
              </Button>
            </CardFooter>
        </Card>
      </section>
      
      {/* Dynamic Content Management */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone /> Publish Campus Alert</CardTitle>
            <CardDescription>Post an announcement for all users</CardDescription>
          </CardHeader>
           <form action={dispatch} ref={formRef}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="alertMessage">Alert Message</Label>
                    <Textarea id="alertMessage" name="alertMessage" placeholder="e.g., The library will be closed tomorrow." required />
                    {state.errors?.alertMessage && <p className="text-sm text-destructive">{state.errors.alertMessage[0]}</p>}
                </div>
            </CardContent>
            <CardFooter>
                <PublishAlertButton />
            </CardFooter>
           </form>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarPlus /> Manage Events</CardTitle>
            <CardDescription>Create or edit campus events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input id="eventName" placeholder="e.g., Annual Sports Day" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input id="eventDate" type="date" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create Event</Button>
          </CardFooter>
        </Card>
      </section>

    </div>
  );
}
