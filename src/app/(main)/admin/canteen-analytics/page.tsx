
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Utensils, Archive } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type SalesData = {
  date: string;
  sales: number;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  itemsSold: number;
  totalRevenue: number;
  stockLevel: number;
};

async function getSalesData(): Promise<SalesData[]> {
  const db = getFirestore(app);
  const salesCol = collection(db, 'canteen-sales');
  const q = query(salesCol, orderBy('date', 'desc'), limit(7));
  const salesSnapshot = await getDocs(q);
  const salesList = salesSnapshot.docs.map(doc => {
    const data = doc.data();
    const date = data.date.toDate();
    return {
      date: format(date, 'yyyy-MM-dd'),
      sales: data.sales,
    };
  }).reverse();
  return salesList;
}

async function getInventoryStatus(): Promise<InventoryItem[]> {
  const db = getFirestore(app);
  const itemsCol = collection(db, 'canteen-items');
  const q = query(itemsCol, orderBy('stockLevel', 'asc')); 
  const itemsSnapshot = await getDocs(q);
  const itemsList = itemsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as InventoryItem));
  return itemsList;
}

export default function InventoryDashboardPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [sales, items] = await Promise.all([getSalesData(), getInventoryStatus()]);
        setSalesData(sales);
        setInventory(items);
      } catch (error) {
        console.error("Failed to fetch inventory analytics data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Utensils /> Total Sales</CardTitle>
          <CardDescription>Daily sales revenue over the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
             <Skeleton className="h-72 w-full" />
           ) : (
             <ChartContainer config={{}} className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis strokeWidth={0} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                     <ChartTooltip content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} />} />
                  </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
           )}
        </CardContent>
      </Card>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Archive /> Current Inventory Status</CardTitle>
                <CardDescription>Live stock levels for all items. Low stock items are highlighted.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Items Sold</TableHead>
                            <TableHead className="text-right">Stock Level</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-1/2 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : inventory.map(item => (
                            <TableRow key={item.id} className={item.stockLevel < 20 ? 'bg-destructive/10' : ''}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right">{item.itemsSold}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="font-medium">{item.stockLevel}</span>
                                        {item.stockLevel < 20 && <Badge variant="destructive">Low</Badge>}
                                    </div>
                                    <Progress value={(item.stockLevel / 100) * 100} className="h-1 mt-1" />
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
