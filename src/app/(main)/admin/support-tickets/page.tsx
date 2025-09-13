
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

type SupportTicket = {
  id: string;
  subject: string;
  user: string;
  status: string;
  createdAt: string;
};

async function getSupportTickets(): Promise<SupportTicket[]> {
  const db = getFirestore(app);
  const ticketsCol = collection(db, 'support-tickets');
  const q = query(ticketsCol, orderBy('createdAt', 'desc'));
  const ticketsSnapshot = await getDocs(q);
  const ticketsList = ticketsSnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt as Timestamp;
    return {
      id: doc.id,
      subject: data.subject,
      user: data.userEmail,
      status: data.status,
      createdAt: createdAt ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true }) : 'Just now',
    };
  });
  return ticketsList;
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const ticketsData = await getSupportTickets();
        setTickets(ticketsData);
      } catch (error) {
        console.error("Failed to fetch support tickets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Support Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HelpCircle /> All Support Tickets</CardTitle>
          <CardDescription>A complete log of all active and past support tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-48">User</TableHead>
                <TableHead className="text-right w-48">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-3/4 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : tickets.length > 0 ? tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium max-w-sm truncate">{ticket.subject}</TableCell>
                  <TableCell><Badge variant={ticket.status.toLowerCase() === 'open' ? 'destructive' : 'default'}>{ticket.status}</Badge></TableCell>
                  <TableCell>{ticket.user}</TableCell>
                  <TableCell className="text-right">{ticket.createdAt}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No support tickets found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    