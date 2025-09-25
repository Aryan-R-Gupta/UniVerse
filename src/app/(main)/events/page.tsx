
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events } from "@/lib/data";
import Image from "next/image";

type Category = 'All' | 'Workshops' | 'Cultural' | 'Tech' | 'Sports' | 'Volunteer';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category || 'All';
  const [filter, setFilter] = useState<Category>(initialCategory);

  useEffect(() => {
    setFilter(initialCategory);
  }, [initialCategory]);


  const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events & Volunteering</h1>
        <p className="text-muted-foreground">Discover what's happening on campus.</p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['All', 'Workshops', 'Cultural', 'Tech', 'Sports', 'Volunteer'] as Category[]).map(category => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            onClick={() => setFilter(category)}
            className="shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <Card key={event.id} className="overflow-hidden group">
            <div className="relative">
              <Image src={event.image} alt={event.title} width={600} height={400} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={event.dataAiHint} />
               <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{event.category}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground">Date: {event.date}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href={`/events/${event.slug}/register`}>Register</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
    
