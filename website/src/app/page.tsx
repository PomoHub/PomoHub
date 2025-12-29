"use client";

import Link from "next/link";
import { Timer, CheckSquare, Download, Github, Smartphone, Users, Cloud, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppCarousel } from "@/components/AppCarousel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "Social Spaces",
      description: "Create private rooms, invite friends via code, and focus together with real-time status updates.",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      title: "Real-time Chat",
      description: "Chat with your study buddies directly within your Space. Share tips, motivation, and stay connected.",
      icon: MessageCircle,
      color: "bg-pink-500",
    },
    {
      title: "Cloud Sync",
      description: "Seamlessly sync your habits, tasks, and sessions across all your devices (Desktop & Mobile).",
      icon: Cloud,
      color: "bg-blue-500",
    },
    {
      title: "Pomodoro Timer",
      description: "Customizable timer with work/break intervals, silent notifications, and circular progress visualization.",
      icon: Timer,
      color: "bg-red-500",
    },
    {
      title: "Habit Tracker",
      description: "Track daily habits with streak monitoring, heatmaps, and custom color coding.",
      icon: CheckSquare,
      color: "bg-green-500",
    },
    {
      title: "Mobile Support",
      description: "Take your productivity on the go with our new Android application. Stay synced everywhere.",
      icon: Smartphone,
      color: "bg-purple-500",
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-sm font-medium text-indigo-700 dark:text-indigo-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v0.2.0 - The Social Update
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-b from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent"
          >
            Productivity is Better<br />Together.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Join <strong>Spaces</strong>, chat with friends, and track habits together. 
            Experience the new social way to focus with PomoHub v0.2.0.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
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
          </motion.div>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <AppCarousel />
        </motion.div>
      </section>

      {/* Social Features Highlight */}
      <section className="py-24 bg-indigo-50 dark:bg-indigo-950/20 border-y border-indigo-100 dark:border-indigo-900/50">
         <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                <Users size={16} />
                New in v0.2.0
              </div>
              <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Introducing Spaces</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Productivity doesn&apos;t have to be lonely. Create a Space, invite your friends, and see their focus status in real-time.
              </p>
              <ul className="space-y-4">
                {[
                  "Create private rooms for study groups or work teams",
                  "Real-time status updates (Focusing, Break, Idle)",
                  "Built-in chat to share resources and motivation",
                  "See who is online and what they are working on"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0">
                      <CheckSquare size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
               {/* Mock UI for Space */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                        DS
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Deep Work Squad</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                          3 Online
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">A</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Alex</span>
                          <span className="text-xs text-zinc-400">Focusing (15:00)</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1.5 overflow-hidden">
                           <div className="h-full bg-indigo-500 w-3/4"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">S</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Sarah</span>
                          <span className="text-xs text-zinc-400">Break (04:20)</span>
                        </div>
                         <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1.5 overflow-hidden">
                           <div className="h-full bg-green-500 w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                     <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Alex:</span> Let&apos;s go for another 25m round! 🚀
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Everything You Need</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">A complete productivity suite, now supercharged with social features.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 hover:border-zinc-200 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm", feature.color)}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
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
