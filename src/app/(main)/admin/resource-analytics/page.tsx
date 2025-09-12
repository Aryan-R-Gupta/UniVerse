
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BookOpen, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const bookingData = [
  { resource: 'Study Room 1A', bookings: 45 },
  { resource: 'Chemistry Lab', bookings: 75 },
  { resource: 'Library', bookings: 120 },
  { resource: 'Basketball Court', bookings: 80 },
];

const resourceDetails = [
    { id: 1, name: 'Study Rooms', total: 10, booked: 8, utilization: 80 },
    { id: 2, name: 'Computer Labs', total: 5, booked: 5, utilization: 100 },
    { id: 3, name: 'Sports Courts', total: 4, booked: 2, utilization: 50 },
    { id: 4, name: 'Auditoriums', total: 2, booked: 1, utilization: 50 },
];

export default function ResourceAnalyticsPage() {
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Resource Analytics</h1>
      
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen /> Booking Distribution</CardTitle>
              <CardDescription>Number of bookings per resource in the last 30 days.</CardDescription>
            </CardHeader>
             <CardContent>
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
                        {resourceDetails.map(resource => (
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
