# Changelog

## [0.2.0] - 2025-12-29 (The Social Update)

### Added
- **Authentication:**
    - Secure Registration & Login with JWT.
    - Password complexity validation (8 chars, 1 Upper, 1 Lower, 1 Special).
    - Username validation (English characters only).
- **Social Features:**
    - **Spaces:** Create and join spaces (max 3 per user).
    - **Chat:** Real-time messaging within spaces (WebSocket).
    - **Live Status:** See other members' online/pomodoro status.
    - **Profile:** Customizable profiles with Avatar, Banner, and Bio.
    - **Posts:** Share productivity updates with images.
- **Productivity Sync:**
    - Automatic synchronization of Habits and Todos between local (SQLite) and remote (PostgreSQL).
    - Offline-first architecture.
- **Backend:**
    - Go (Fiber) API with PostgreSQL and Redis (Valkey).
    - Docker support for easy deployment.
- **Mobile UI:**
    - Dedicated mobile layout with bottom navigation.
    - Responsive dashboard and new "Profile" tab.

### Changed
- **Architecture:** Transitioned to a Hybrid (Offline + Online) model.
- **Design:** Improved UI consistency with new Tailwind classes and animations.

## [0.1.4] - 2025-12-28
- Added Mobile Layout.
- Added Notes with Drawing support.
- Improved Dashboard with Bento Grid.

## [0.1.0] - 2025-12-27
- Initial Release.
- Basic Pomodoro Timer.
- Habit Tracking (Local).
- Todo List (Local).
