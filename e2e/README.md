# E2E 測試架構

## 資料夾結構

```
e2e/
├── fixtures/           # 測試 fixture
│   └── editor.ts
├── pages/              # Page Object Model
│   └── EditorPage.ts
├── utils/              # 工具函數
│   ├── device.ts
│   └── helpers.ts
│
├── smoke/              # 冒煙測試（快速驗證基本功能）
│   ├── basic.spec.ts
│   ├── basic.desktop.spec.ts
│   └── basic.mobile.spec.ts
│
├── features/           # 功能測試
│   ├── background.spec.ts
│   ├── crop.spec.ts
│   ├── decor.spec.ts
│   ├── toolbar.spec.ts
│   └── text/
│       ├── text.spec.ts
│       ├── text-properties.spec.ts
│       ├── text-advanced.spec.ts
│       └── text-layer.spec.ts
│
├── layout/             # 佈局測試
│   ├── sidebar.spec.ts
│   ├── sidebar.desktop.spec.ts
│   ├── sidebar.mobile.spec.ts
│   └── panel-auto-switch.spec.ts
│
├── interaction/        # 互動測試
│   ├── canvas.spec.ts
│   ├── canvas-interaction.spec.ts
│   ├── keyboard.spec.ts
│   └── touch.mobile.spec.ts
│
└── regression/         # 回歸測試（Bug 修復驗證）
    ├── edge-cases.spec.ts
    └── scroll-shift.mobile.spec.ts
```

## 文件命名規則

- `*.desktop.spec.ts` - 桌面端測試
- `*.mobile.spec.ts` - 移動端測試
- `*.spec.ts` - 通用測試

## 測試配置

在 `playwright.config.ts` 中配置了四個項目：

| 項目 | 設備 | 視口 |
|------|------|------|
| `desktop-chromium` | Desktop Chrome | 1920x1080 |
| `desktop-webkit` | Desktop Safari | 1920x1080 |
| `mobile-chromium` | Pixel 5 | 393x851 |
| `mobile-webkit` | iPhone 12 | 390x844 |

## 使用方式

### 運行所有測試
```bash
npx playwright test
```

### 運行特定類別
```bash
# 冒煙測試
npx playwright test smoke/

# 功能測試
npx playwright test features/

# 回歸測試
npx playwright test regression/
```

### 運行特定設備
```bash
# 桌面端
npx playwright test --project=desktop-chromium

# 手機端
npx playwright test --project=mobile-webkit
```

### 運行特定文件
```bash
npx playwright test features/text/text.spec.ts
npx playwright test regression/scroll-shift.mobile.spec.ts
```

## EditorPage API

```typescript
// 設備類型
await editor.getDeviceType() // 'desktop' | 'mobile'
await editor.isMobile()
await editor.isDesktop()

// Sidebar
await editor.sidebar.clickTab('bg' | 'text' | 'decor' | 'crop')
await editor.sidebar.expectMobileLayout()
await editor.sidebar.expectDesktopLayout()

// Panel
await editor.panel.expectVisible()
await editor.panel.expectHidden()
await editor.panel.closeMobile()

// Toolbar
await editor.toolbar.clickDownload()
await editor.toolbar.clickReset()
await editor.toolbar.expectZoom('100%')

// Canvas
await editor.clickCanvasCenter()
await editor.getCanvasBoundingBox()
```
