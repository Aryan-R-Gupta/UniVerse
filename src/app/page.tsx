import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold">CampusLife Hub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Button asChild>
             <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your All-in-One Campus Companion
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CampusLife Hub simplifies your university experience. Manage your timetable, order food, discover events, and navigate campus with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Go to App
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/landing/600/400"
                alt="Hero"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint="university campus life"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need in one place</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From academics to social life, we've got you covered. Spend less time organizing and more time experiencing.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                 <Image src="https://picsum.photos/seed/feature1/300/200" alt="Timetable" width={300} height={200} className="rounded-lg object-cover w-full aspect-video mx-auto" data-ai-hint="student calendar schedule" />
                <h3 className="text-xl font-bold mt-4">Smart Timetable</h3>
                <p className="text-muted-foreground">Never miss a class with our intuitive and always up-to-date timetable.</p>
              </div>
              <div className="grid gap-1 text-center">
                <Image src="https://picsum.photos/seed/feature2/300/200" alt="Canteen" width={300} height={200} className="rounded-lg object-cover w-full aspect-video mx-auto" data-ai-hint="food delivery order" />
                <h3 className="text-xl font-bold mt-4">Canteen Ordering</h3>
                <p className="text-muted-foreground">Pre-order your meals from the campus canteen and skip the long queues.</p>
              </div>
              <div className="grid gap-1 text-center">
                <Image src="https://picsum.photos/seed/feature3/300/200" alt="Events" width={300} height={200} className="rounded-lg object-cover w-full aspect-video mx-auto" data-ai-hint="campus event festival" />
                <h3 className="text-xl font-bold mt-4">Event Discovery</h3>
                <p className="text-muted-foreground">Stay in the loop with all the latest workshops, fests, and sports events.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CampusLife Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}