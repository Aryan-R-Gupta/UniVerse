# UniVerse: Your All-in-One Campus Companion

UniVerse is a modern, unified web application designed to streamline campus life for students, teachers, and administrators. It integrates everything from academic schedules and resource booking to social events and canteen ordering into a single, easy-to-use platform. Powered by AI, UniVerse is more than just a utility—it's a smart companion for your university journey.

![UniVerse Landing Page](https://images.unsplash.com/flagged/photo-1554473675-d0904f3cbf38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8Y29sbGVnZXxlbnwwfHx8fDE3NTc2NzA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080)

## ✨ Core Features

UniVerse is packed with features designed to make campus life simpler, more connected, and more engaging.

### For Students & Faculty

*   **Unified Dashboard**: A central hub to see your next class, upcoming events, and quick actions at a glance.
*   **AI-Powered Navigation**: Lost on campus? Our AI guide can provide you with step-by-step directions to any location, including estimated time and distance.
*   **AI Campus Persona**: Discover your unique campus identity! Based on your activity—from the events you join to the food you order—our AI generates a fun, creative persona for you.
*   **Canteen Ordering**: Browse the canteen menu, add items to your cart, and place your order directly from the app.
*   **Event Discovery & Registration**: Find out what's happening on campus, filter events by category, and register for workshops, cultural fests, and more with a single click.
*   **Resource Booking**: Need a study room or lab equipment? Easily view availability and book resources in real-time.
*   **Timetable Management**: A clear, day-by-day view of your class schedule.
*   **Feedback & Support**: A direct line to the administration for submitting feedback or raising support tickets.

### For Administrators

*   **Live Analytics Dashboards**: Get a bird's-eye view of campus operations with dedicated analytics for:
    *   **Canteen Sales**: Track sales trends, top-selling items, and revenue.
    *   **Event Performance**: Analyze registration trends and event popularity.
    *   **Resource Utilization**: Monitor booking rates and resource usage across campus.
*   **Content Management**: Publish campus-wide alerts and manage event listings.
*   **Feedback & Support Hub**: View and manage all user-submitted feedback and support tickets in one place.

## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Generative AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
*   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
*   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment**: [Vercel](https://vercel.com/)

## 🛠️ Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/universe-app.git
    cd universe-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a new file named `.env` in the root of your project and add your Google AI API key:
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

5.  **(Optional) Seed the Database:**
    To populate your Firestore database with initial data for canteen items, run the seeding script:
    ```bash
    npm run seed:canteen
    ```
    This ensures the canteen analytics and ordering features work correctly from the start.

## ☁️ Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push to Git**: Make sure your code is on a Git repository (GitHub, GitLab, etc.).
2.  **Import to Vercel**: Import your repository into Vercel. It will automatically detect the Next.js framework.
3.  **Add Environment Variable**: In the project settings on Vercel, add the `GEMINI_API_KEY` environment variable with your key.
4.  **Deploy**: Click "Deploy". Vercel will handle the rest!
