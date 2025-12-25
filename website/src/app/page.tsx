import Link from "next/link";
import Image from "next/image";
import { Timer, CheckSquare, Calendar, ListTodo, Target, ArrowRight, Download, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppCarousel } from "@/components/AppCarousel";

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
      description: "Simple yet powerful todo list with due dates and priority sorting.",
      icon: ListTodo,
      color: "bg-orange-500",
    },
    {
      title: "Long-term Goals",
      description: "Set and track progress towards your big life goals.",
      icon: Target,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-zinc-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
             <Image src="/logos/pomohub-logo-black.svg" alt="PomoHub" width={150} height={40} priority />
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/Gktw0o/pomodoro-habit" 
              target="_blank"
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://github.com/Gktw0o/pomodoro-habit/releases/latest"
              target="_blank"
              className="px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-all"
            >
              Download
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sm font-medium text-zinc-600 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v0.1.2 Released
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-b from-zinc-900 to-zinc-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
            Master Your Focus.<br />Build Better Habits.
          </h1>
          
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
            A beautiful, privacy-focused desktop app that combines Pomodoro timer, habit tracking, and goal setting into one seamless experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
            <Link
              href="https://github.com/Gktw0o/pomodoro-habit/releases/latest"
              target="_blank"
              className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-semibold text-lg hover:scale-105 hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-zinc-200"
            >
              <Download size={20} />
              Download for Windows
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-semibold text-lg hover:bg-zinc-50 transition-all flex items-center gap-2"
            >
              Explore Features
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-4 pb-32">
        <AppCarousel />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Everything you need to stay productive</h2>
            <p className="text-lg text-zinc-600">No subscriptions, no accounts, just pure focus.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm", feature.color)}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Pomodoro Habit. Open Source (MIT).
          </div>
          <div className="flex gap-6">
            <Link href="https://github.com/Gktw0o/pomodoro-habit" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              GitHub
            </Link>
            <Link href="https://github.com/Gktw0o/pomodoro-habit/issues" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              Issues
            </Link>
            <Link href="/changelog" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              Changelog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
