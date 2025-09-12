

import { ArrowRight, GraduationCap, LayoutGrid, Cpu, Users, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/shared/theme-toggle';


const testimonials = [
    {
      quote: "UniVerse helped me find my team for our winning hackathon project.",
      name: "Sameer B.",
      title: "2nd Year, Design",
      avatarUrl: "https://picsum.photos/seed/sameer/100/100",
      dataAiHint: "student avatar"
    },
    {
      quote: "Joined 2 clubs in week 1 — game changer!",
      name: "Anika S.",
      title: "3rd Year, CS",
      avatarUrl: "https://picsum.photos/seed/anika/100/100",
      dataAiHint: "student avatar"
    },
    {
      quote: "The leaderboard adds a fun, competitive edge to campus involvement.",
      name: "Mihir T.",
      title: "4th Year, Business",
      avatarUrl: "https://picsum.photos/seed/mihir/100/100",
      dataAiHint: "student avatar"
    },
  ];

const features = [
    {
        icon: <LayoutGrid className="h-8 w-8 text-primary" />,
        title: "Unified Hub",
        description: "Access everything from your timetable to canteen orders in one central place. No more switching between different apps.",
    },
    {
        icon: <Cpu className="h-8 w-8 text-primary" />,
        title: "AI-Powered Assistance",
        description: "Get smart recommendations, navigate campus with AI guidance, and discover your unique campus persona.",
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Community Connection",
        description: "Easily find and register for events, join clubs, and connect with fellow students who share your interests.",
    },
    {
        icon: <CalendarCheck className="h-8 w-8 text-primary" />,
        title: "Effortless Management",
        description: "Book study rooms, manage your schedule, and pre-order meals with just a few taps. Save time and stay organized.",
    }
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <header className="px-4 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl text-foreground tracking-tight">UniVerse</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
                    Your entire campus, connected in one app.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A unified campus platform to schedule, order, book, and discover — all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                   <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                    <Link href="/dashboard">
                      Go to App
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transform hover:-translate-y-1 transition-transform duration-300">
                     <Link href="#">
                        Learn More
                     </Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center p-8">
                 <div className="absolute inset-0 bg-muted/30 backdrop-blur-sm rounded-full -z-10 animate-blob-bounce"></div>
                 <Image
                    src="https://images.unsplash.com/photo-1538334421852-687c439c92f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYW50ZWVufGVufDB8fHx8MTc1NzY3MTEwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Floating mascot one"
                    width={100}
                    height={100}
                    className="absolute top-10 left-10 animate-float"
                    data-ai-hint="cute mascot character"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1741636174186-3fffe1614c39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8Y29sbGVnZSUyMGV2ZW50c3xlbnwwfHx8fDE3NTc2NzEyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Floating mascot two"
                    width={120}
                    height={120}
                    className="absolute bottom-10 right-5 animate-float-delay"
                    data-ai-hint="friendly robot mascot"
                  />
                 <Image
                  src="https://images.unsplash.com/flagged/photo-1554473675-d0904f3cbf38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8Y29sbGVnZXxlbnwwfHx8fDE3NTc2NzA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="App Screenshot"
                  width={600}
                  height={800}
                  className="mx-auto rounded-3xl object-cover shadow-2xl transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105"
                  data-ai-hint="mobile app interface"
                />
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/20 rounded-full blur-lg -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full py-4 bg-muted/50 backdrop-blur-sm shadow-inner overflow-hidden group">
          <div className="marquee flex group-hover:[animation-play-state:paused] motion-safe:animate-marquee">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
                <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-muted-foreground px-8 flex items-center gap-4">
                  <span>Navigate</span>
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span>Join</span>
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span>Experience</span>
                </p>
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
            ))}
          </div>
        </div>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-foreground">Loved by students nationwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-background/80 backdrop-blur-sm border-border/50 shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-background">
                        <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

         <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Why Choose UniVerse?</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    UniVerse is designed to make your campus life simpler, more connected, and more engaging.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-transparent border-0 shadow-none">
                  <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-2">
                        {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t bg-muted/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; 2024 UniVerse. All rights reserved.</p>
          <Link href="/" className="flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">UniVerse</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}

    