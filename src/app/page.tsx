import { ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 to-purple-100/50 text-gray-800 font-body overflow-x-hidden">
      <header className="px-4 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-blue-500" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">UniVerse</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-gray-700 hover:bg-sky-200/50">
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button asChild className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold font-headline tracking-tighter uppercase sm:text-5xl md:text-6xl lg:text-7xl/none">
                    GROUP CHAT THAT'S ALL FUN & GAMES
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    A unified campus platform to schedule, order, book, and discover — all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                   <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                    <Link href="/dashboard">
                      Go to App
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="rounded-full text-gray-700 hover:bg-sky-200/50 transform hover:-translate-y-1 transition-transform duration-300">
                     <Link href="#">
                        Learn More
                     </Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center p-8">
                 <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-full -z-10 animate-blob-bounce"></div>
                 <Image
                    src="https://picsum.photos/seed/mascot1/100/100"
                    alt="Floating mascot one"
                    width={100}
                    height={100}
                    className="absolute top-10 left-10 animate-float"
                    data-ai-hint="cute mascot character"
                  />
                  <Image
                    src="https://picsum.photos/seed/mascot2/120/120"
                    alt="Floating mascot two"
                    width={120}
                    height={120}
                    className="absolute bottom-10 right-5 animate-float-delay"
                    data-ai-hint="friendly robot mascot"
                  />
                 <Image
                  src="https://picsum.photos/seed/app-screenshot/400/600"
                  alt="App Screenshot"
                  width={350}
                  height={525}
                  className="mx-auto rounded-3xl object-cover shadow-2xl transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105"
                  data-ai-hint="mobile app interface"
                />
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/20 rounded-full blur-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="w-full py-4 bg-white/50 backdrop-blur-sm shadow-inner overflow-hidden group">
        <div className="marquee flex group-hover:[animation-play-state:paused] motion-safe:animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-gray-700 px-8">ONE STOP FOR EVERYONE</p>
              <GraduationCap className="h-6 w-6 text-blue-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

    