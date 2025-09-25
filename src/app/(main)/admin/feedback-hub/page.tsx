
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

type Feedback = {
  id: string;
  text: string;
  submittedAt: string;
};

async function getFeedback(): Promise<Feedback[]> {
  const db = getFirestore(app);
  const feedbackCol = collection(db, 'feedback');
  const q = query(feedbackCol, orderBy('createdAt', 'desc'));
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

export default function FeedbackHubPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const feedbackData = await getFeedback();
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Feedback Hub</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare /> All User Feedback</CardTitle>
          <CardDescription>A complete log of all feedback submitted by users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feedback</TableHead>
                <TableHead className="text-right w-48">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-3/4 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : feedback.length > 0 ? feedback.map(fb => (
                <TableRow key={fb.id}>
                  <TableCell className="max-w-prose">{fb.text}</TableCell>
                  <TableCell className="text-right">{fb.submittedAt}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24">No feedback submitted yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
