
import { NavigationClient } from './client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function NavigationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Campus Navigation</h1>
        <p className="text-muted-foreground">Let our AI guide you to your destination on campus.</p>
      </div>
      <Card>
        <CardContent className="p-2">
           <Image
            src="https://images.unsplash.com/photo-1659292862395-2ded345088df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjb2xsZWdlcyUyMCUyMGluZGlhfGVufDB8fHx8MTc1NzY3MjU4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Campus map"
            width={1200}
            height={800}
            className="rounded-lg object-cover aspect-[16/9]"
            data-ai-hint="campus map"
          />
        </CardContent>
      </Card>
      <NavigationClient />
    </div>
  );
}
