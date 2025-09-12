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
            src="https://picsum.photos/seed/campusmap/1200/800"
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
