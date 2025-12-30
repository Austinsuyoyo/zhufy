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

- Vue 3
- TypeScript
- Fabric.js
- Tailwind CSS

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
│   ├── config/            # Configuration files
│   └── style.css          # Global styles
├── e2e/                   # E2E tests
│   ├── fixtures/          # Test fixtures
│   ├── pages/             # Page object models
│   └── utils/              # Test utilities
└── public/
    └── backgrounds/       # Background images
```

## 📝 Development

### Adding Background Images

Place background images in `public/backgrounds/` and configure them in `src/config/constants.ts`:

```typescript
backgrounds: [{ url: '/backgrounds/your-image.jpg' }]
```
