
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BookOpen, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

type BookingData = {
  resource: string;
  bookings: number;
};

type ResourceUtilization = {
  id: string;
  name: string;
  total: number;
  booked: number;
  utilization: number;
};

async function getBookingDistribution(): Promise<BookingData[]> {
  const db = getFirestore(app);
  const bookingsCol = collection(db, 'resource-bookings');
  const bookingsSnapshot = await getDocs(bookingsCol);

  const counts: { [key: string]: number } = {};
  bookingsSnapshot.docs.forEach(doc => {
    const resourceName = doc.data().resourceName;
    if (resourceName) {
      counts[resourceName] = (counts[resourceName] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([resource, bookings]) => ({ resource, bookings }));
}

async function getResourceUtilization(): Promise<ResourceUtilization[]> {
  const db = getFirestore(app);
  const resourcesCol = collection(db, 'resources');
  const bookingsCol = collection(db, 'resource-bookings');
  
  const resourcesSnapshot = await getDocs(resourcesCol);
  
  const utilizationByCategory: { [key: string]: { total: number; booked: number } } = {};

  for (const resourceDoc of resourcesSnapshot.docs) {
    const resourceData = resourceDoc.data();
    const category = resourceData.category || 'Other'; // e.g., Study Rooms, Labs

    if (!utilizationByCategory[category]) {
      utilizationByCategory[category] = { total: 0, booked: 0 };
    }
    utilizationByCategory[category].total += 1;
  }
  
  const bookingsSnapshot = await getDocs(query(bookingsCol, where('status', '==', 'Confirmed')));

  for (const bookingDoc of bookingsSnapshot.docs) {
      const resourceId = bookingDoc.data().resourceId;
      // This is simplified. A real app would check booking times.
      // We find the resource to get its category.
      const resource = resourcesSnapshot.docs.find(d => d.id === resourceId)?.data();
      if(resource) {
        const category = resource.category || 'Other';
         if (utilizationByCategory[category]) {
            utilizationByCategory[category].booked += 1;
        }
      }
  }

  return Object.entries(utilizationByCategory).map(([name, data], index) => ({
    id: String(index + 1),
    name,
    ...data,
    utilization: data.total > 0 ? Math.round((data.booked / data.total) * 100) : 0,
  }));
}


export default function ResourceAnalyticsPage() {
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [utilizationData, setUtilizationData] = useState<ResourceUtilization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [bookings, utilization] = await Promise.all([getBookingDistribution(), getResourceUtilization()]);
        setBookingData(bookings);
        setUtilizationData(utilization);
      } catch (error) {
        console.error("Failed to fetch resource analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Resource Analytics</h1>
      
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen /> Booking Distribution</CardTitle>
              <CardDescription>Number of bookings per resource.</CardDescription>
            </CardHeader>
             <CardContent>
                {loading ? (
                    <Skeleton className="h-72 w-full" />
                ) : (
                   <ChartContainer config={{}} className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bookingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <XAxis dataKey="resource" tick={false} />
                           <YAxis strokeWidth={0} />
                          <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={8} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        </BarChart>
                      </ResponsiveContainer>
                  </ChartContainer>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Percent /> Resource Utilization</CardTitle>
                <CardDescription>Current booking status and utilization rate by category.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Resource Type</TableHead>
                            <TableHead>Status (Booked/Total)</TableHead>
                            <TableHead className="text-right">Utilization</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-1/2 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : utilizationData.map(resource => (
                            <TableRow key={resource.id}>
                                <TableCell className="font-medium">{resource.name}</TableCell>
                                <TableCell>{resource.booked} / {resource.total}</TableCell>
                                <TableCell className="text-right space-y-2">
                                    <div className="flex items-center justify-end gap-2">
                                         <span>{resource.utilization}%</span>
                                        <Progress value={resource.utilization} className="w-24"/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
