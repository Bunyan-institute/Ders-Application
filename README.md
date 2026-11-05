# Sheikh's Learning App 📚🎧

An Islamic educational audio and course learning mobile application built with React Native and Expo Router.

## Features

- 📖 **Structured Courses & Categories**: Browse Islamic lectures, dars, and educational audio series.
- 🎵 **Audio Player**: Background playback, progress tracking, and playback controls.
- 🔖 **Bookmarks & Favorites**: Save and easily revisit important lessons and series.
- 📥 **Offline Downloads**: Download lessons for offline listening.
- 🔍 **Search**: Fast search across courses, categories, and lessons.
- 📱 **Cross-Platform**: Built for Android, iOS, and Web with Expo.

## Tech Stack

- **Framework**: [Expo](https://expo.dev) / [React Native](https://reactnative.dev) (Expo SDK 54, React 19)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Audio & Media**: [Expo AV](https://docs.expo.dev/versions/latest/sdk/audio/) & [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- **Runtime / Package Manager**: [Bun](https://bun.sh)

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh) (or Node.js / npm) installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/Bunyan-institute/Ders-Application.git
cd Ders-Application

# Install dependencies
bun install
```

### Running the App

```bash
# Start the Expo development server
bun start

# Run on Android
bun run android

# Run on iOS
bun run ios

# Run on Web
bun run web
```

### Testing & Type Checking

```bash
# Run tests
bun test

# Type check TypeScript
bun run typecheck
```

## License

MIT
