
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Utensils, Calendar as CalendarIcon } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const salesData = [
  { date: '2023-12-01', sales: 4500 },
  { date: '2023-12-02', sales: 4800 },
  { date: '2023-12-03', sales: 5200 },
  { date: '2023-12-04', sales: 4900 },
  { date: '2023-12-05', sales: 5500 },
  { date: '2023-12-06', sales: 6000 },
  { date: '2023-12-07', sales: 5800 },
];

const topItems = [
    { id: 1, name: 'Veg Thali', category: 'Meals', itemsSold: 120, totalRevenue: 14400 },
    { id: 2, name: 'Cold Coffee', category: 'Drinks', itemsSold: 250, totalRevenue: 12500 },
    { id: 3, name: 'Samosa', category: 'Snacks', itemsSold: 500, totalRevenue: 7500 },
    { id: 4, name: 'Burger', category: 'Snacks', itemsSold: 90, totalRevenue: 6300 },
];

export default function CanteenAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Canteen Analytics</h1>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Utensils /> Total Sales</CardTitle>
          <CardDescription>Daily sales revenue over the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={{}} className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis strokeWidth={0} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                   <ChartTooltip content={<ChartTooltipContent formatter={(value) => `₹${value.toLocaleString()}`} />} />
                </LineChart>
              </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

       <Card>
            <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Most popular items by revenue.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Items Sold</TableHead>
                            <TableHead className="text-right">Total Revenue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right">{item.itemsSold}</TableCell>
                                <TableCell className="text-right">₹{item.totalRevenue.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
