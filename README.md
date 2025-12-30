# Zhufy - 長輩圖產生器

**[English](./README.en.md)** | **[中文](./README.md)**

基於 Vue 3、TypeScript 和 Fabric.js 建置的高效能長輩圖編輯器。可建立包含背景、文字、濾鏡、表情符號等元素的精美長輩圖。

## ✨ 功能特色

- **背景管理** - 預設背景與自訂圖片上傳
- **照片濾鏡** - 模糊、亮度、對比度調整
- **文字編輯** - 字體、大小、顏色、描邊、方向控制
- **文字範本** - 預設文字樣式（標題、副標題、裝飾）
- **表情符號裝飾** - 豐富的表情符號庫
- **自訂貼圖** - 上傳並新增自訂貼圖
- **圖片裁切** - 精確裁切，支援邊界限制
- **圖層管理** - 物件圖層與選取
- **畫布縮放** - 滑鼠滾輪縮放（Ctrl + 滾輪）
- **鍵盤快捷鍵** - 刪除物件、複製（Ctrl+D）

## 🛠️ 技術棧

- **Vue 3** - Composition API 響應式 UI
- **TypeScript** - 型別安全開發
- **Vite** - 快速開發與建置工具
- **Pinia** - 狀態管理
- **Fabric.js** - Canvas 操作與編輯
- **Tailwind CSS** - 工具優先的 CSS 框架
- **Lucide Vue Next** - 現代圖示庫
- **Playwright** - E2E 測試框架

## 🚀 快速開始

### 環境需求

- Node.js `^20.19.0 || >=22.12.0`
- npm 或 yarn

### 安裝

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 📁 專案結構

```
zhufy/
├── src/
│   ├── components/          # Vue 組件
│   │   ├── panels/         # 面板組件（背景、文字、裝飾、裁切）
│   ├── composables/        # Composition API hooks
│   ├── stores/            # Pinia stores
│   ├── utils/              # 工具函數
│   │   ├── debounce.ts    # Debounce 工具
│   │   ├── throttle.ts    # Throttle 工具
│   │   ├── fabricImageCache.ts  # 圖片緩存
│   │   └── renderManager.ts     # 渲染優化
│   ├── config/            # 配置檔案
│   └── style.css          # 全域樣式
├── e2e/                   # E2E 測試
│   ├── fixtures/          # 測試 fixtures
│   ├── pages/             # Page Object Models
│   └── utils/              # 測試工具
└── public/
    └── backgrounds/       # 背景圖片
```

## 🧪 測試

```bash
# 執行 E2E 測試
npm run test:e2e

# 使用 UI 執行 E2E 測試
npm run test:e2e:ui

# 除錯模式執行 E2E 測試
npm run test:e2e:debug

# 有頭模式執行 E2E 測試
npm run test:e2e:headed
```

## ⚡ 效能優化

本專案包含 25+ 項效能優化：

### 高優先級
- 濾鏡滑桿防抖（150ms）
- 文字屬性調整防抖（50ms）
- Vue 條件渲染（無需 innerHTML）
- 圖片緩存機制
- 下載操作使用 RequestIdleCallback

### 中優先級
- Vue refs 存取 DOM（減少查詢）
- v-for 渲染網格
- 文字輸入框防抖（300ms）
- 顏色選擇器防抖（100ms）
- 優化裁切座標計算

### 低優先級
- 滾輪縮放使用 RAF 節流
- 優化 CSS 過渡效果
- 組件化圖示載入
- 優化事件處理
- 基於 transform 的動畫

### 架構優化
- 統一的 debounce/throttle 工具
- 集中使用 requestAnimationFrame
- 圖片預載入系統
- Fabric.js 渲染優化（renderOnAddRemove: false）
- Tailwind 使用 Vite 插件（非 CDN）

## 📝 開發說明

### 新增背景圖片

將背景圖片放置在 `public/backgrounds/` 目錄，並在 `src/config/constants.ts` 中配置：

```typescript
backgrounds: [
  { url: "/backgrounds/your-image.jpg" }
]
```

### 程式碼品質

```bash
# 型別檢查
npm run type-check

# 程式碼檢查
npm run lint

# 程式碼格式化
npm run format
```

## 📄 授權

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
