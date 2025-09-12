import type { LucideIcon } from 'lucide-react';
import { BookMarked, CalendarDays, Home, Utensils, PartyPopper, User, Library, Salad, Search, Book, Navigation, Bell, TestTube, Dribbble, Compass, MessageSquare } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: 'Home', href: '/', icon: Home },
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
    { id: 1, name: 'Samosa', price: 15, image: 'https://picsum.photos/seed/samosa/200/200', dataAiHint: 'samosa' },
    { id: 2, name: 'Veg Puff', price: 20, image: 'https://picsum.photos/seed/puff/200/200', dataAiHint: 'veg puff' },
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
