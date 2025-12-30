# Zhufy - Greeting Card Generator

**[English](./README.en.md)** | **[中文](./README.md)**

A modern, high-performance greeting card editor built with Vue 3, TypeScript, and Fabric.js. Create beautiful greeting cards with backgrounds, text, filters, emojis, and more.

## ✨ Features

- **Background Management** - Preset backgrounds and custom image upload
- **Photo Filters** - Blur, brightness, and contrast adjustments
- **Text Editing** - Font, size, color, stroke, and direction control
- **Text Templates** - Pre-configured text styles (title, subtitle, decorative)
- **Emoji Decorations** - Rich emoji library for card decoration
- **Custom Stickers** - Upload and add custom stickers
- **Image Cropping** - Precise crop with boundary constraints
- **Layer Management** - Object layering and selection
- **Canvas Zoom** - Zoom in/out with mouse wheel (Ctrl + scroll)
- **Keyboard Shortcuts** - Delete objects, duplicate (Ctrl+D)

## 🛠️ Tech Stack

- **Vue 3** - Composition API for reactive UI
- **TypeScript** - Type-safe development
- **Vite** - Fast development and build tool
- **Pinia** - State management
- **Fabric.js** - Canvas manipulation and editing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue Next** - Modern icon library
- **Playwright** - E2E testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
zhufy/
├── src/
│   ├── components/          # Vue components
│   │   ├── panels/         # Panel components (Background, Text, Decor, Crop)
│   ├── composables/        # Composition API hooks
│   ├── stores/            # Pinia stores
│   ├── utils/              # Utility functions
│   │   ├── debounce.ts    # Debounce utility
│   │   ├── throttle.ts    # Throttle utility
│   │   ├── fabricImageCache.ts  # Image caching
│   │   └── renderManager.ts     # Render optimization
│   ├── config/            # Configuration files
│   └── style.css          # Global styles
├── e2e/                   # E2E tests
│   ├── fixtures/          # Test fixtures
│   ├── pages/             # Page object models
│   └── utils/              # Test utilities
└── public/
    └── backgrounds/       # Background images
```

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run E2E tests in headed mode
npm run test:e2e:headed
```

## ⚡ Performance Optimizations

This project includes 25+ performance optimizations:

### High Priority

- Debounced filter sliders (150ms)
- Debounced text property adjustments (50ms)
- Vue conditional rendering (no innerHTML)
- Image caching mechanism
- RequestIdleCallback for download operations

### Medium Priority

- Vue refs for DOM access (reduced queries)
- v-for for grid rendering
- Debounced textarea input (300ms)
- Debounced color picker (100ms)
- Optimized crop coordinate calculations

### Low Priority

- RAF throttling for wheel zoom
- Optimized CSS transitions
- Component-based icon loading
- Optimized event handling
- Transform-based animations

### Architecture

- Unified debounce/throttle utilities
- Centralized requestAnimationFrame usage
- Image preloading system
- Fabric.js render optimization (renderOnAddRemove: false)
- Tailwind via Vite plugin (not CDN)

## 📝 Development

### Adding Background Images

Place background images in `public/backgrounds/` and configure them in `src/config/constants.ts`:

```typescript
backgrounds: [{ url: '/backgrounds/your-image.jpg' }]
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format
```

## 📄 License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
