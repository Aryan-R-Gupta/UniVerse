
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BarChart2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

type RegistrationData = {
  date: string;
  [key: string]: number | string; // Allows for dynamic category keys
};

type EventPerformance = {
  id: string;
  name: string;
  category: string;
  registrations: number;
  attendance: number; // For simplicity, we'll make attendance a random percentage of registrations
  feedback: number; // Mocked for now
};

async function getRegistrationData(): Promise<RegistrationData[]> {
  const db = getFirestore(app);
  const registrationsCol = collection(db, 'event-registrations');
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const q = query(registrationsCol, where('registeredAt', '>=', sevenDaysAgo));
  const registrationsSnapshot = await getDocs(q);

  const dailyCounts: { [date: string]: { [category: string]: number } } = {};
  const categories = new Set<string>();

  registrationsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.registeredAt && data.eventCategory) {
      const date = format(data.registeredAt.toDate(), 'yyyy-MM-dd');
      const category = data.eventCategory;
      categories.add(category);
      if (!dailyCounts[date]) {
        dailyCounts[date] = {};
      }
      if (!dailyCounts[date][category]) {
        dailyCounts[date][category] = 0;
      }
      dailyCounts[date][category]++;
    }
  });

  const formattedData = Object.keys(dailyCounts).map(date => {
    const entry: RegistrationData = { date };
    categories.forEach(cat => {
        entry[cat] = dailyCounts[date][cat] || 0;
    });
    return entry;
  });

  return formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

async function getEventPerformance(): Promise<EventPerformance[]> {
  const db = getFirestore(app);
  const eventsCol = collection(db, 'events'); // Assuming an 'events' collection
  const registrationsCol = collection(db, 'event-registrations');

  const eventsSnapshot = await getDocs(query(eventsCol, orderBy('date', 'desc'), limit(4)));
  const performanceList: EventPerformance[] = [];

  for (const eventDoc of eventsSnapshot.docs) {
    const eventData = eventDoc.data();
    const eventId = eventDoc.id;

    const registrationsQuery = query(registrationsCol, where('eventId', '==', eventId));
    const registrationsSnapshot = await getDocs(registrationsQuery);
    const registrations = registrationsSnapshot.size;

    performanceList.push({
      id: eventId,
      name: eventData.title,
      category: eventData.category,
      registrations: registrations,
      // Mocking attendance and feedback for demonstration
      attendance: Math.floor(registrations * (Math.random() * (0.9 - 0.7) + 0.7)),
      feedback: parseFloat((Math.random() * (5 - 4.2) + 4.2).toFixed(1)),
    });
  }

  return performanceList;
}

export default function EventAnalyticsPage() {
  const [registrationData, setRegistrationData] = useState<RegistrationData[]>([]);
  const [eventPerformance, setEventPerformance] = useState<EventPerformance[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [regData, perfData] = await Promise.all([getRegistrationData(), getEventPerformance()]);
        
        const allCategories = new Set<string>();
        regData.forEach(d => Object.keys(d).forEach(k => {
          if(k !== 'date') allCategories.add(k);
        }));

        setRegistrationData(regData);
        setEventPerformance(perfData);
        setCategories(Array.from(allCategories));

      } catch (error) {
        console.error("Failed to fetch event analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Event Analytics</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp /> Registration Trends</CardTitle>
          <CardDescription>Daily new registrations by event category for the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
             <Skeleton className="h-72 w-full" />
           ) : (
            <ChartContainer config={{}} className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis strokeWidth={0} />
                      <defs>
                        {categories.map((cat, i) => (
                           <linearGradient key={cat} id={`color${cat}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0}/>
                           </linearGradient>
                        ))}
                      </defs>
                      {categories.map((cat, i) => (
                        <Area key={cat} type="monotone" dataKey={cat} stroke={chartColors[i % chartColors.length]} fill={`url(#color${cat})`} />
                      ))}
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
           )}
        </CardContent>
      </Card>

      <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2 /> Event Performance</CardTitle>
                <CardDescription>Detailed comparison of the 4 most recent events.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Registrations</TableHead>
                            <TableHead className="text-right">Attendance</TableHead>
                            <TableHead className="text-right">Feedback (/5)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                          Array.from({ length: 4 }).map((_, index) => (
                              <TableRow key={index}>
                                  <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                  <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                                  <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                                  <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                                  <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                              </TableRow>
                          ))
                        ) : eventPerformance.map(event => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.name}</TableCell>
                                <TableCell><Badge variant="outline">{event.category}</Badge></TableCell>
                                <TableCell className="text-right">{event.registrations}</TableCell>
                                <TableCell className="text-right">{event.attendance}</TableCell>
                                <TableCell className="text-right font-medium">{event.feedback}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
