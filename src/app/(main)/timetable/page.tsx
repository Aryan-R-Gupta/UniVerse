'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { timetableData } from "@/lib/data";
import { ChevronLeft, ChevronRight, Plus, Navigation } from "lucide-react";
import { cn } from '@/lib/utils';

type Day = keyof typeof timetableData;

const daysOfWeek: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetablePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const handlePrevWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Timetable</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">
            {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle>{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timetableData[day].length > 0 ? (
                timetableData[day].map((session, index) => (
                  <div key={index} className={cn("p-3 rounded-lg", session.color)}>
                    <p className="font-bold">{session.subject}</p>
                    <p className="text-sm">{session.faculty}</p>
                    <p className="text-sm font-medium mt-1">{session.room} &bull; {session.time}</p>
                    <Button size="sm" variant="ghost" className="mt-2 h-8 w-full justify-start pl-0 text-current hover:bg-black/10">
                        <Navigation className="mr-2 h-4 w-4" /> Navigate
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No classes scheduled.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button className="fixed bottom-20 right-4 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90">
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add slot</span>
      </Button>
    </div>
  );
}
