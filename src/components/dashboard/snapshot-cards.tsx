
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { nextClass, canteenItems, upcomingEvent, activeBookings } from "@/lib/data";
import { ArrowRight, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SnapshotCards() {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Today's Snapshot</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {/* Next Class Card */}
        <Card className="min-w-[300px] flex-shrink-0">
          <CardHeader>
            <CardTitle>Next Class</CardTitle>
            <CardDescription>{nextClass.courseCode}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{nextClass.faculty}</p>
            <p className="text-sm text-muted-foreground">Room: {nextClass.room}</p>
            <p className="text-sm text-muted-foreground">Time: {nextClass.time}</p>
          </CardContent>
          <CardFooter>
            <Button asChild size="sm">
              <Link href="/navigation"><Navigation className="mr-2 h-4 w-4" />Navigate</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Canteen Quick Order Card */}
        <Card className="min-w-[300px] flex-shrink-0">
          <CardHeader>
            <CardTitle>Canteen Quick Order</CardTitle>
            <CardDescription>Grab a bite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {canteenItems.slice(0, 2).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint={item.dataAiHint} />
                  <p className="font-medium">{item.name}</p>
                </div>
                <Button variant="outline" size="sm">Pre-Order</Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/canteen">View Menu <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Active Bookings Card */}
        <Card className="min-w-[300px] flex-shrink-0">
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
            <CardDescription>Your reserved resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeBookings.count}</p>
            <p className="text-muted-foreground">bookings today</p>
          </CardContent>
          <CardFooter>
             <Button asChild variant="secondary" className="w-full">
              <Link href="/resources">View All</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
