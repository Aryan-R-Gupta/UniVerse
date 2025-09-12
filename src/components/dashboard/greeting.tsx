'use client';

import { useState, useEffect } from 'react';

export function Greeting() {
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Good Morning, Kanksha 👋
      </h1>
      <p className="text-muted-foreground">{date}</p>
    </div>
  );
}
