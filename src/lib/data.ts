
import type { LucideIcon } from 'lucide-react';
import { BookMarked, CalendarDays, Home, Utensils, PartyPopper, User, Library, Salad, Search, Book, Navigation, Bell, TestTube, Dribbble, Compass, MessageSquare, HelpCircle, Shield, BarChart2, BookOpen, Utensils as UtensilsIcon, QrCode } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const studentNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Timetable', href: '/timetable', icon: CalendarDays },
  { title: 'Canteen', href: '/canteen', icon: Utensils },
  { title: 'Events', href: '/events', icon: PartyPopper },
  { title: 'Navigate', href: '/navigation', icon: Compass },
  { title: 'Feedback', href: '/feedback', icon: MessageSquare },
  { title: 'Support', href: '/support', icon: HelpCircle },
  { title: 'Profile', href: '/profile', icon: User },
];

export const teacherNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Timetable', href: '/timetable', icon: CalendarDays },
  { title: 'Canteen', href: '/canteen', icon: Utensils },
  { title: 'Events', href: '/events', icon: PartyPopper },
  { title: 'Resources', href: '/resources', icon: BookMarked },
  { title: 'Navigate', href: '/navigation', icon: Compass },
  { title: 'Feedback', href: '/feedback', icon: MessageSquare },
  { title: 'Support', href: '/support', icon: HelpCircle },
  { title: 'Profile', href: '/profile', icon: User },
];

export const adminNavItems: NavItem[] = [
  { title: 'Overview', href: '/admin/dashboard', icon: Shield },
  { title: 'Canteen Analytics', href: '/admin/canteen-analytics', icon: UtensilsIcon },
  { title: 'Resource Analytics', href: '/admin/resource-analytics', icon: BookOpen },
  { title: 'Event Analytics', href: '/admin/event-analytics', icon: BarChart2 },
  { title: 'Event Check-in', href: '/admin/event-check-in', icon: QrCode },
  { title: 'Canteen', href: '/canteen', icon: Utensils },
  { title: 'Events', href: '/events', icon: PartyPopper },
  { title: 'Feedback Hub', href: '/admin/feedback-hub', icon: MessageSquare },
  { title: 'Support Tickets', href: '/admin/support-tickets', icon: HelpCircle },
  { title: 'Profile', href: '/profile', icon: User },
];

export const navItems: NavItem[] = studentNavItems;


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
  { name: 'Veg Burger', price: 60, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxidXJnZXJ8ZW58MHx8fHwxNzU3NjY3Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'veg burger' },
  { name: 'Iced Coffee', price: 80, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY29mZmVlfGVufDB8fHx8MTc1NzY2ODkxOXww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'iced coffee' },
  { name: 'Fries', price: 40, image: 'https://picsum.photos/seed/fries/200/200', dataAiHint: 'fries' },
];

export const upcomingEvent = {
  title: 'Hackathon 5.0',
  slug: 'hackathon-5-0',
  image: 'https://images.unsplash.com/photo-1637073849667-91120a924221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoYWNrYXRob258ZW58MHx8fHwxNzU3NjY5NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  dataAiHint: 'hackathon event'
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
    { id: 2, name: 'Chaat', price: 20, image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', dataAiHint: 'aesthetic college canteen' },
    { id: 7, name: 'Noodles', price: 40, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxub29kbGVzfGVufDB8fHx8MTc1NzY2NzAxOXww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'noodles' },
    { id: 8, name: 'Fried Rice', price: 50, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmcmllZCUyMHJpY2V8ZW58MHx8fHwxNzU3NjY3MDY3fDA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'fried rice' },
    { id: 9, name: 'Vada Pav', price: 15, image: 'https://images.unsplash.com/photo-1750767397012-3413ba4fdbc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8dmFkYSUyMHBhdnxlbnwwfHx8fDE3NTc2NjcxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'vada pav' },
    { id: 10, name: 'Idli', price: 30, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpZGxpfGVufDB8fHx8MTc1NzY2NzE1OHww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'idli' },
    { id: 11, name: 'Medu Vada', price: 35, image: 'https://images.unsplash.com/photo-1730191843435-073792ba22bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx2YWRhfGVufDB8fHx8MTc1NzY2NzI2MXww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'medu vada' },
    { id: 12, name: 'Pizza', price: 120, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwaXp6YXxlbnwwfHx8fDE3NTc2NjczNjN8MA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'pizza' },
    { id: 13, name: 'Burger', price: 70, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxidXJnZXJ8ZW58MHx8fHwxNzU3NjY3Mzc4fDA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'burger' },
  ],
  drinks: [
    { id: 3, name: 'Cold Coffee', price: 50, image: 'https://images.unsplash.com/photo-1530373239216-42518e6b4063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2xkJTIwY29mZmVlfGVufDB8fHx8MTc1NzY2NzUwOXww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'cold coffee' },
    { id: 4, name: 'Masala Chai', price: 15, image: 'https://images.unsplash.com/photo-1630748662359-40a2105640c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHhjaGFpfGVufDB8fHx8MTc1NzY2NzU1MXww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'masala chai' },
  ],
  meals: [
    { id: 5, name: 'Veg Thali', price: 120, image: 'https://images.unsplash.com/photo-1680359873864-43e89bf248ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8dmVnJTIwdGhhYWxpfGVufDB8fHx8MTc1NzY2NzYzN3ww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'veg thali' },
    { id: 6, name: 'Non veg thaali', price: 160, image: 'https://images.unsplash.com/photo-1723066217456-cf0b10ceda2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8Y2hpY2tlbiUyMHRoYWFsaXxlbnwwfHx8fDE3NTc2NzIyMjV8MA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'non-veg thali' },
  ]
}

export const events = [
  { id: 1, title: 'AI & The Future', slug: 'ai-and-the-future', category: 'Workshops', date: 'Dec 15', image: 'https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxBSSUyMHxlbnwwfHx8fDE3NTc1Nzk3ODB8MA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'AI workshop' },
  { id: 2, title: 'Encore - Music Fest', slug: 'encore-music-fest', category: 'Cultural', date: 'Dec 18', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtdXNpYyUyMGZlc3R8ZW58MHx8fHwxNzU3NjY5NTM2fDA&ixlibrb-4.1.0&q=80&w=1080', dataAiHint: 'music festival' },
  { id: 3, title: 'Hackathon 5.0', slug: 'hackathon-5-0', category: 'Tech', date: 'Dec 20', image: 'https://images.unsplash.com/photo-1637073849667-91120a924221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoYWNrYXRob258ZW58MHx8fHwxNzU3NjY5NDQ5fDA&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'hackathon event' },
  { id: 4, title: 'University Soccer League', slug: 'university-soccer-league', category: 'Sports', date: 'Dec 22', image: 'https://images.unsplash.com/photo-1583027383321-51847ab7ada0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8U29jY2VyJTIwTGVhZ3VlfGVufDB8fHx8MTc1NzY2OTU1OHww&ixlib-rb-4.1.0&q=80&w=1080', dataAiHint: 'soccer match' },
];

export const resources = [
  { id: 1, name: 'Study Room 1A', location: 'Library, 1st Floor', available: true, icon: BookMarked },
  { id: 2, name: 'Chemistry Lab', location: 'Science Block, 2nd Floor', available: false, icon: TestTube },
  { id: 3, name: 'Central Library', location: 'Main Building', available: true, icon: Library },
  { id: 4, name: 'Basketball Court', location: 'Sports Complex', available: true, icon: Dribbble },
];

export const userProfileData = {
  name: 'Kanksha Dakua',
  studentId: '12345',
  email: 'kanksha@university.edu',
  avatarUrl: 'https://picsum.photos/seed/kanksha/100/100',
  course: 'Bsc IT',
  year: 2,
};

export const registeredEvents = [
  { ...events[2] }, // Hackathon 5.0
  { ...events[1] }, // Encore - Music Fest
];

export const recentOrders = [
    { ...allCanteenItems.snacks[8], quantity: 1, id: 13 }, // Burger
    { ...allCanteenItems.drinks[0], quantity: 2, id: 3 }, // Cold Coffee
];

export const userBookings = [
  { id: 1, resourceName: 'Study Room 1A', timeSlot: 'Today, 4:00 PM - 5:00 PM', status: 'Confirmed' },
  { id: 2, resourceName: 'Basketball Court', timeSlot: 'Today, 6:00 PM - 7:00 PM', status: 'Confirmed' },
];
