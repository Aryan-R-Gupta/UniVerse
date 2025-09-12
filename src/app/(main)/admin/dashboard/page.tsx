
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BarChart, LineChart, PieChart, Users, MessageSquare, HelpCircle, Megaphone, CalendarPlus, BarChart2, BookOpen, Utensils } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, Pie, Line, ResponsiveContainer, PieLabel } from 'recharts';

const analyticsData = {
  canteenSales: [
    { hour: '9am', sales: 45 },
    { hour: '11am', sales: 75 },
    { hour: '1pm', sales: 120 },
    { hour: '3pm', sales: 80 },
    { hour: '5pm', sales: 60 },
  ],
  resourceBookings: [
    { name: 'Study Rooms', value: 400 },
    { name: 'Labs', value: 300 },
    { name: 'Courts', value: 200 },
  ],
  eventPopularity: [
    { name: 'Tech', value: 500 },
    { name: 'Cultural', value: 800 },
    { name: 'Sports', value: 650 },
  ],
};

const mockFeedback = [
    { id: 1, text: "The app is great, but it would be nice to have a dark mode for the map.", submittedAt: "2 days ago" },
    { id: 2, text: "The canteen menu should show allergens.", submittedAt: "3 days ago" },
];

const mockSupportTickets = [
    { id: 1, subject: "Can't register for event", user: "payal.soni@universe.edu", status: "Open", createdAt: "1 day ago" },
    { id: 2, subject: "Payment failed for canteen", user: "kanksha.d@universe.edu", status: "Closed", createdAt: "4 days ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Administrator Dashboard</h1>

      {/* Live Campus Analytics */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Live Campus Analytics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Utensils /> Canteen Sales</CardTitle>
              <CardDescription>Peak ordering times</CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={{}} className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.canteenSales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                       <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen /> Resource Bookings</CardTitle>
              <CardDescription>Most booked resource types</CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={{}} className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analyticsData.resourceBookings} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="hsl(var(--primary))" label />
                       <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart2 /> Event Popularity</CardTitle>
              <CardDescription>Interest by category</CardDescription>
            </CardHeader>
             <CardContent>
               <ChartContainer config={{}} className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.eventPopularity} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
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
                        {mockFeedback.map(fb => (
                            <TableRow key={fb.id}>
                                <TableCell className="truncate max-w-xs">{fb.text}</TableCell>
                                <TableCell className="text-right">{fb.submittedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
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
                        {mockSupportTickets.map(ticket => (
                            <TableRow key={ticket.id}>
                                <TableCell className="font-medium truncate max-w-40">{ticket.subject}</TableCell>
                                <TableCell><Badge variant={ticket.status === 'Open' ? 'destructive' : 'default'}>{ticket.status}</Badge></TableCell>
                                <TableCell className="text-right">{ticket.user}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </section>
      
      {/* Dynamic Content Management */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone /> Publish Campus Alert</CardTitle>
            <CardDescription>Post an announcement for all users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="alertMessage">Alert Message</Label>
                <Textarea id="alertMessage" placeholder="e.g., The library will be closed tomorrow." />
            </div>
          </CardContent>
           <CardFooter>
            <Button className="w-full">Publish Alert</Button>
          </CardFooter>
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
