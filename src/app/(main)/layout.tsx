import { AppSidebar } from "@/components/shared/app-sidebar";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { AppHeader } from "@/components/shared/app-header";
import { redirect } from 'next/navigation';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userLoggedIn = true; // Replace with actual auth check

  if (!userLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-col md:pl-64">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
            {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
