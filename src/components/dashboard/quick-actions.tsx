
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { quickActions } from '@/lib/data';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const [userType, setUserType] = useState('Student');

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') || 'Student';
    setUserType(storedUserType);

    const handleStorageChange = () => {
        const updatedUserType = localStorage.getItem('userType') || 'Student';
        setUserType(updatedUserType);
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredActions = userType === 'Administrator' 
    ? quickActions.filter(action => action.label !== 'Find Event')
    : quickActions;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {filteredActions.map((action) => (
        <Button key={action.label} asChild variant="outline" className="h-16 flex-col gap-1 md:h-20 md:flex-row md:justify-start md:px-4">
          <Link href={action.href} className="flex items-center gap-2">
            <action.icon className="h-5 w-5" />
            <span className="text-sm">{action.label}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
