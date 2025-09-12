
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, GraduationCap } from "lucide-react";
import { studentNavItems, teacherNavItems, adminNavItems, type NavItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

function AppSidebarContent() {
    const pathname = usePathname();
    const [navItems, setNavItems] = useState<NavItem[]>(studentNavItems);
    const [userType, setUserType] = useState('Student');

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUserType = localStorage.getItem('userType') || 'Student';
            setUserType(storedUserType);
            switch (storedUserType) {
                case 'Teacher':
                    setNavItems(teacherNavItems);
                    break;
                case 'Administrator':
                    setNavItems(adminNavItems);
                    break;
                default:
                    setNavItems(studentNavItems);
                    break;
            }
        };

        handleStorageChange(); // Initial check
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    return (
        <>
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="">UniVerse</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                      (pathname === item.href || (item.href === '/admin/dashboard' && pathname.startsWith('/admin'))) && "bg-muted text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3">
                <Image
                  src="https://picsum.photos/seed/kanksha/100/100"
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                  data-ai-hint="profile picture"
                />
                <div>
                  <p className="font-semibold">Kanksha Dakua</p>
                  <p className="text-xs text-muted-foreground">{userType}</p>
                </div>
              </div>
            </div>
        </>
    )
}


export function AppSidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40 w-64 bg-card border-r">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <AppSidebarContent />
      </div>
    </aside>
  );
}

    