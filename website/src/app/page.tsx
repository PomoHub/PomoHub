import Link from "next/link";
import Image from "next/image";
import { Timer, CheckSquare, Calendar, ListTodo, Target, ArrowRight, Download, Github, Smartphone, Bell, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppCarousel } from "@/components/AppCarousel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";

export default function Home() {
  const features = [
    {
      title: "Pomodoro Timer",
      description: "Customizable timer with work/break intervals and circular progress visualization.",
      icon: Timer,
      color: "bg-red-500",
    },
    {
      title: "Habit Tracker",
      description: "Track daily habits with streak monitoring and custom color coding.",
      icon: CheckSquare,
      color: "bg-green-500",
    },
    {
      title: "Calendar & Stats",
      description: "Monthly overview of your productivity with daily insights and activity logs.",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Task Management",
      description: "Simple yet powerful todo list with due dates, priority sorting, and daily reminders.",
      icon: ListTodo,
      color: "bg-orange-500",
    },
    {
      title: "Long-term Goals",
      description: "Set and track progress towards your big life goals.",
      icon: Target,
      color: "bg-purple-500",
    },
    {
      title: "Mobile Support",
      description: "Take your productivity on the go with our new Android application.",
      icon: Smartphone,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-50 dark:selection:text-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
             <BrandLogo />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="https://github.com/PomoHub/PomoHub" 
              target="_blank"
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://github.com/PomoHub/PomoHub/releases/latest"
              target="_blank"
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
            >
              Download
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v0.1.4 Released
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-b from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
            Master Your Focus.<br />Build Better Habits.
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
            A beautiful, privacy-focused app that combines Pomodoro timer, habit tracking, and goal setting into one seamless experience. Now available on Windows & Android.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
            <Link
              href="https://github.com/PomoHub/PomoHub/releases/latest"
              target="_blank"
              className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold text-lg hover:scale-105 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-zinc-200 dark:shadow-zinc-900/50"
            >
              <Download size={20} />
              Download for Windows
            </Link>
             <Link
              href="https://github.com/PomoHub/PomoHub/releases/latest"
              target="_blank"
              className="px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <Smartphone size={20} />
              Get Android APK
            </Link>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-4 pb-32">
        <AppCarousel />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Everything you need to stay productive</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">No subscriptions, no accounts, just pure focus.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 hover:border-zinc-200 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm", feature.color)}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">
            © {new Date().getFullYear()} PomoHub. Open Source (MIT).
          </div>
          <div className="flex gap-6">
            <Link href="https://github.com/PomoHub/PomoHub" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              GitHub
            </Link>
            <Link href="https://github.com/PomoHub/PomoHub/issues" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Issues
            </Link>
            <Link href="/changelog" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Changelog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
