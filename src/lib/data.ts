
import type { LucideIcon } from 'lucide-react';
import { BookMarked, CalendarDays, Home, Utensils, PartyPopper, User, Library, Salad, Search, Book, Navigation, Bell, TestTube, Dribbble, Compass, MessageSquare } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Timetable', href: '/timetable', icon: CalendarDays },
  { title: 'Canteen', href: '/canteen', icon: Utensils },
  { title: 'Events', href: '/events', icon: PartyPopper },
  { title: 'Resources', href: '/resources', icon: BookMarked },
  { title: 'Navigate', href: '/navigation', icon: Compass },
  { title: 'Feedback', href: '/feedback', icon: MessageSquare },
  { title: 'Profile', href: '/profile', icon: User },
];

export const quickActions = [
  { label: 'Order Food', href: '/canteen', icon: Salad },
  { label: 'Find Event', href: '/events', icon: Search },
  { label: 'Book Room', href: '/resources', icon: Book },
  { label: 'Navigate', href: '/navigation', icon: Navigation },
];

export const nextClass = {
  courseCode: 'CS-305',
  faculty: 'Dr. Alan Turing',
  room: 'A-101',
  time: '11:00 AM',
};

export const canteenItems = [
  { name: 'Veg Burger', price: 60, image: 'https://picsum.photos/seed/burger/200/200', dataAiHint: 'veg burger' },
  { name: 'Iced Coffee', price: 80, image: 'https://picsum.photos/seed/coffee/200/200', dataAiHint: 'iced coffee' },
  { name: 'Fries', price: 40, image: 'https://picsum.photos/seed/fries/200/200', dataAiHint: 'fries' },
];

export const upcomingEvent = {
  title: 'InnovateX 2024',
  image: 'https://picsum.photos/seed/innovatex/600/400',
  dataAiHint: 'tech conference'
};

export const activeBookings = {
  count: 2,
};

export const timetableData = {
  'Monday': [
    { subject: 'Data Structures', faculty: 'Dr. Ada Lovelace', room: 'B-203', time: '9:00 - 10:00 AM', color: 'bg-blue-100 text-blue-800' },
    { subject: 'Project Lab', faculty: 'Prof. Tim Berners-Lee', room: 'Lab 5', time: '11:00 AM - 1:00 PM', color: 'bg-green-100 text-green-800' },
  ],
  'Tuesday': [
    { subject: 'Algorithms', faculty: 'Dr. Donald Knuth', room: 'C-101', time: '10:00 - 11:00 AM', color: 'bg-yellow-100 text-yellow-800' },
  ],
  'Wednesday': [
    { subject: 'Data Structures', faculty: 'Dr. Ada Lovelace', room: 'B-203', time: '9:00 - 10:00 AM', color: 'bg-blue-100 text-blue-800' },
    { subject: 'Operating Systems', faculty: 'Dr. Linus Torvalds', room: 'A-301', time: '2:00 - 3:00 PM', color: 'bg-purple-100 text-purple-800' },
  ],
  'Thursday': [
    { subject: 'Algorithms', faculty: 'Dr. Donald Knuth', room: 'C-101', time: '10:00 - 11:00 AM', color: 'bg-yellow-100 text-yellow-800' },
  ],
  'Friday': [
     { subject: 'Operating Systems', faculty: 'Dr. Linus Torvalds', room: 'A-301', time: '2:00 - 3:00 PM', color: 'bg-purple-100 text-purple-800' },
  ],
  'Saturday': [],
};

export const allCanteenItems = {
  snacks: [
    { id: 1, name: 'Samosa', price: 15, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYW1vc2F8ZW58MHx8fHwxNzU3NjY2NTA1fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'samosa' },
    { id: 2, name: 'Chaat', price: 20, image: 'https://images.unsplash.com/photo-1653850280260-aa3b9e00b230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGFhdHxlbnwwfHx8fDE3NTc2NjY2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'chaat' },
    { id: 7, name: 'Noodles', price: 40, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxub29kbGVzfGVufDB8fHx8MTc1NzY2NzAxOXww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'noodles' },
    { id: 8, name: 'Fried Rice', price: 50, image: 'https://picsum.photos/seed/friedrice/200/200', dataAiHint: 'fried rice' },
    { id: 9, name: 'Vada Pav', price: 15, image: 'https://picsum.photos/seed/vadapav/200/200', dataAiHint: 'vada pav' },
    { id: 10, name: 'Idli', price: 30, image: 'https://picsum.photos/seed/idli/200/200', dataAiHint: 'idli' },
    { id: 11, name: 'Medu Vada', price: 35, image: 'https://picsum.photos/seed/meduvada/200/200', dataAiHint: 'medu vada' },
    { id: 12, name: 'Upma', price: 25, image: 'https://picsum.photos/seed/upma/200/200', dataAiHint: 'upma' },
    { id: 13, name: 'Poha', price: 25, image: 'https://picsum.photos/seed/poha/200/200', dataAiHint: 'poha' },
  ],
  drinks: [
    { id: 3, name: 'Cold Coffee', price: 50, image: 'https://picsum.photos/seed/coldcoffee/200/200', dataAiHint: 'cold coffee' },
    { id: 4, name: 'Masala Chai', price: 15, image: 'https://picsum.photos/seed/chai/200/200', dataAiHint: 'masala chai' },
  ],
  meals: [
    { id: 5, name: 'Veg Thali', price: 120, image: 'https://picsum.photos/seed/thali/200/200', dataAiHint: 'veg thali' },
    { id: 6, name: 'Chole Bhature', price: 90, image: 'https://picsum.photos/seed/chole/200/200', dataAiHint: 'chole bhature' },
  ]
}

export const events = [
  { id: 1, title: 'AI & The Future', category: 'Workshops', date: 'Dec 15', image: 'https://picsum.photos/seed/eventai/600/400', dataAiHint: 'AI workshop' },
  { id: 2, title: 'Encore - Music Fest', category: 'Cultural', date: 'Dec 18', image: 'https://picsum.photos/seed/eventmusic/600/400', dataAiHint: 'music festival' },
  { id: 3, title: 'Hackathon 5.0', category: 'Tech', date: 'Dec 20', image: 'https://picsum.photos/seed/eventhack/600/400', dataAiHint: 'hackathon event' },
  { id: 4, title: 'University Soccer League', category: 'Sports', date: 'Dec 22', image: 'https://picsum.photos/seed/eventsoccer/600/400', dataAiHint: 'soccer match' },
];

export const resources = [
  { id: 1, name: 'Study Room 1A', location: 'Library, 1st Floor', available: true, icon: BookMarked },
  { id: 2, name: 'Chemistry Lab', location: 'Science Block, 2nd Floor', available: false, icon: TestTube },
  { id: 3, name: 'Central Library', location: 'Main Building', available: true, icon: Library },
  { id: 4, name: 'Basketball Court', location: 'Sports Complex', available: true, icon: Dribbble },
];
