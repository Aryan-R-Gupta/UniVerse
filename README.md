# UniVerse: Your All-in-One Campus Companion

UniVerse is a modern, AI-powered web application designed to streamline campus life. Built with Next.js and Google's Genkit, it integrates academic schedules, resource booking, canteen ordering, and campus events into a single, intuitive platform for students, teachers, and administrators.

![UniVerse Landing Page](https://images.unsplash.com/flagged/photo-1554473675-d0904f3cbf38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8Y29sbGVnZXxlbnwwfHx8fDE3NTc2NzA1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080)

## ✨ Key Features

*   **AI-Powered Campus Life**: Get smart directions with AI navigation, discover a unique "Campus Persona" based on your activity, and receive intelligent recommendations.
*   **Unified Dashboard**: A central hub for timetables, upcoming events, and quick actions.
*   **Effortless Ordering & Booking**: Pre-order meals from the canteen and book campus resources like study rooms in real-time.
*   **Event Discovery**: Find and register for campus events, from workshops to cultural festivals.
*   **Administrator Analytics**: Live dashboards for canteen sales, event registrations, and resource utilization.
*   **Feedback & Support**: A direct line for users to submit feedback and support tickets.

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
