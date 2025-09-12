
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BarChart2, TrendingUp } from "lucide-react";

const registrationData = [
  { date: 'Dec 1', Tech: 20, Cultural: 35, Sports: 15 },
  { date: 'Dec 2', Tech: 25, Cultural: 40, Sports: 20 },
  { date: 'Dec 3', Tech: 30, Cultural: 55, Sports: 25 },
  { date: 'Dec 4', Tech: 28, Cultural: 60, Sports: 30 },
  { date: 'Dec 5', Tech: 40, Cultural: 70, Sports: 35 },
  { date: 'Dec 6', Tech: 50, Cultural: 80, Sports: 40 },
];

const eventPopularity = [
    { id: 1, name: 'Encore - Music Fest', category: 'Cultural', registrations: 800, attendance: 650, feedback: 4.8 },
    { id: 2, name: 'University Soccer League', category: 'Sports', registrations: 650, attendance: 600, feedback: 4.6 },
    { id: 3, name: 'Hackathon 5.0', category: 'Tech', registrations: 500, attendance: 480, feedback: 4.9 },
    { id: 4, name: 'AI & The Future', category: 'Workshops', registrations: 300, attendance: 280, feedback: 4.7 },
];

export default function EventAnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Event Analytics</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp /> Registration Trends</CardTitle>
          <CardDescription>Daily new registrations by event category.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={{}} className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis strokeWidth={0} />
                    <defs>
                        <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCultural" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorSports" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="Tech" stroke="hsl(var(--chart-1))" fill="url(#colorTech)" />
                    <Area type="monotone" dataKey="Cultural" stroke="hsl(var(--chart-2))" fill="url(#colorCultural)" />
                    <Area type="monotone" dataKey="Sports" stroke="hsl(var(--chart-3))" fill="url(#colorSports)" />
                   <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2 /> Event Performance</CardTitle>
                <CardDescription>Detailed comparison of all recent events.</CardDescription>
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
                        {eventPopularity.map(event => (
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
