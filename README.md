<div align="center">

<img align="center" alt="GitHub License" src="https://img.shields.io/github/license/PomoHub/PomoHub">
<img align="center" alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/PomoHub/PomoHub">
<img align="center" alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/PomoHub/PomoHub/total">
<img align="center" alt="GitHub Sponsors" src="https://img.shields.io/github/sponsors/PomoHub">

</div>

# PomoHub 🍅

A modern, all-in-one productivity application built with **Tauri**, **React**, and **TypeScript**. Combine the power of the Pomodoro technique with habit tracking, goal setting, and task management in a beautiful, customizable interface.

## ✨ Features

### 🍅 Pomodoro Timer
- **Customizable Modes:** Switch between Work, Short Break, and Long Break.
- **Visual Progress:** Elegant circular progress indicator.
- **Session Logging:** Automatically logs work sessions to track your focus time.
- **Configurable Settings:** Adjust durations for work and breaks to suit your workflow.

### ✅ Habit Tracker
- **Daily Tracking:** Easily mark habits as completed for the day.
- **Color Coding:** Assign custom colors to different habits for better visualization.
- **Streak Logic:** Visual cues for completed habits (strikethrough and color fill).
- **Persistent Data:** All habits and logs are stored locally.

### 📅 Calendar
- **Monthly Overview:** View your activity across the entire month.
- **Daily Insights:** Click on any day to see detailed stats:
  - Habits completed
  - Total focus time (Pomodoro minutes)
  - Tasks finished
- **Visual Indicators:** Color-coded dots on calendar days show activity types.

### 📝 Todo List
- **Task Management:** Create, read, update, and delete tasks.
- **Due Dates:** Assign due dates to keep track of deadlines.
- **Smart Sorting:** Uncompleted tasks always appear at the top.

### 🎯 Goals
- **Long-term Tracking:** Set numeric goals (e.g., "Read 10 Books").
- **Progress Bars:** Visual progress tracking with percentage indicators.
- **Target Dates:** Set deadlines for your goals.

### ⚙️ Customization
- **Theme Support:** Switch between **Light**, **Dark**, or **System** themes.
- **Custom Backgrounds:** Choose any image from your computer as the application background.
- **Privacy First:** All data is stored locally on your device using SQLite.

---

## 🗺️ Roadmap

### v0.1.0 (Current)
- [x] Basic Application Infrastructure (Tauri + React)
- [x] SQLite Database Integration
- [x] Pomodoro Timer Feature
- [x] Habit Tracker Feature
- [x] Calendar & Stats Feature
- [x] Todo List Feature
- [x] Goals Feature
- [x] Settings (Theme & Background)

### v0.1.1 (Bug Fixes & Improvements)
- **Fix:** Resolved database connection issues preventing creation of Habits, Todos, and Goals.
- **Fix:** Fixed theme switching not applying correctly.
- **Fix:** Corrected Calendar stats aggregation.
- **New:** Added configurable auto-transition between Pomodoro modes.
- **New:** Added "Long Break Interval" setting to customize session count before long break.
- **New:** Added sound notification (placeholder) on timer completion.

### v0.1.2
- **New:** User Onboarding & Profile System (Name, Birthday).
- **New:** Birthday Celebration with confetti.
- **New:** Seasonal Winter Snowfall effect (Dec-Feb).
- **New:** Profile Page with comprehensive statistics (Total Time, Streaks).
- **New:** Achievements System with unlock notifications.
- **New:** Customizable Notification Sounds (Presets).
- **New:** Android Support (Tauri Mobile initialized).

### v0.1.3
- **New:** Daily Task Reminders (Notifications).
- **Improvement:** Reliable Background Timer (Timestamp-based logic).
- **Improvement:** Native Notifications for Desktop & Android.
- **Improvement:** Custom Notification Sounds (File selection).
- **Fix:** Android background execution issues.

### v0.1.4 (Current)
- **New:** Desktop Window Title Timer (Visible countdown in title bar).
- **New:** Note Taking System (Text, Drawings, Attachments).
- **New:** Smart Macros (Create Todos/Tasks directly from notes with `@create-todo` syntax).
- **Improvement:** Persistent Mobile Notifications (Lock screen timer updates).
- **Improvement:** Notification Sound Reliability (Fallback beep mechanism).
- **Fix:** Desktop Notification Spam (Optimized notification frequency).

### v0.2.0 (Planned)
- [x] **Social Spaces:** Create private rooms, invite friends via code, and focus together.
- [x] **Real-time Chat:** Chat with friends in your space.
- [x] **Friend System:** Add friends, block users, and see what they are up to.
- [x] **Cloud Sync:** Sync data across Desktop and Mobile (Android).
- [x] **Mobile Support:** Fully responsive mobile layout (Spaces requires landscape).
- [ ] **Habit Streaks:** Detailed streak counters and statistics.
- [ ] **Data Export/Import:** Backup your data to JSON/CSV.
- [ ] **Keyboard Shortcuts:** Global hotkeys for timer control.

### v1.0.0 (Future)
- [ ] **Cloud Sync:** Optional synchronization across devices.
- [ ] **Advanced Analytics:** Charts and graphs for long-term productivity trends.
- [ ] **Gamification:** Badges and achievements for reaching goals.

## 📱 Mobile Support (Android)

PomoHub is available for Android!
- **Requirements:** Android SDK, Java 17+, Rust, Tauri CLI.
- **Build:** `bun tauri android build`
- **Run:** `bun tauri android dev`

---

## 🛠️ Tech Stack

- **Core:** [Tauri v2](https://tauri.app/) (Rust)
- **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [TailwindCSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database:** [SQLite](https://www.sqlite.org/) (via `tauri-plugin-sql`)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Building from Source

1.  **Prerequisites:**
    - Install [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/).
    - Install [Rust](https://www.rust-lang.org/tools/install).
    - Install **Visual Studio Build Tools** with "C++ Desktop Development" (Windows only).

2.  **Install Dependencies:**
    ```bash
    bun install
    ```

3.  **Run in Development Mode:**
    ```bash
    bun run tauri dev
    ```

4.  **Build for Production (Desktop):**
    ```bash
    bun run tauri build
    ```

5.  **Build for Android:**
    - Ensure Android Studio and SDK are installed.
    - Connect an Android device or start an emulator.
    - Run:
      ```bash
      bun run tauri android dev
      ```
    - For release APK:
      ```bash
      bun run tauri android build
      ```
    The executable will be located in `src-tauri/target/release/bundle/nsis/`.

---

## 📄 License

MIT License. See `LICENSE` for more information.
