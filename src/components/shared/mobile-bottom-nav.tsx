
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { studentNavItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  
  
  
  const mainNavItems = studentNavItems.filter(item => ['Dashboard', 'Timetable', 'Canteen', 'Events', 'Profile'].includes(item.title));


  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50">
      <div className="flex justify-around items-center h-full">
        {mainNavItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-muted-foreground transition-colors",
              pathname === item.href ? "text-primary" : "hover:text-primary"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
