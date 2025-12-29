"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  { src: "/main-page.jpg", alt: "Main Dashboard - Overview of your day" },
  { src: "/pomodoro-page.jpg", alt: "Pomodoro Timer - Focus with customizable intervals" },
  { src: "/habits-page.jpg", alt: "Habit Tracker - Build streaks and consistency" },
  { src: "/calender-page.jpg", alt: "Calendar - Visualize your productivity history" },
  { src: "/todo-page.jpg", alt: "Todo List - Manage your tasks efficiently" },
  { src: "/goals-page.jpg", alt: "Goals - Track long-term progress" },
  { src: "/settings-page.jpg", alt: "Settings - Customize theme and background" },
];

export function AppCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-900/10 group">
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-4 md:p-8"
          >
            <div className="relative w-full h-full">
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent text-white text-center">
        <p className="text-lg font-medium">{images[currentIndex].alt}</p>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 backdrop-blur-sm z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 backdrop-blur-sm z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all shadow-sm ${
              idx === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
