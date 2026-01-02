<template>
  <div
    class="min-h-screen relative bg-white flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-slate-200/60 to-transparent"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-slate-200/60 to-transparent"
      ></div>

      <div class="absolute top-1/4 left-[10%] w-2 h-2 bg-slate-300 rounded-full opacity-40"></div>
      <div class="absolute top-1/3 right-[20%] w-3 h-3 bg-slate-300 rounded-full opacity-30"></div>
      <div
        class="absolute bottom-1/4 right-[15%] w-2 h-2 bg-slate-300 rounded-full opacity-40"
      ></div>
      <div
        class="absolute bottom-1/3 left-[25%] w-4 h-4 bg-slate-200 rounded-full opacity-30"
      ></div>
      <div
        class="absolute top-1/2 right-[30%] w-2 h-2 bg-slate-300 rounded-full opacity-50 hidden sm:block"
      ></div>

      <div
        class="absolute -top-20 sm:-top-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-50 rounded-full blur-3xl opacity-20"
      ></div>
      <div
        class="absolute -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-slate-100 rounded-full blur-3xl opacity-30"
      ></div>
    </div>

    <div class="w-full max-w-6xl relative z-10">
      <div class="text-center mb-8 sm:mb-12">
        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-3 sm:mb-4"
        >
          送祝福，就這麼簡單
        </h1>
        <p class="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 px-2">
          選圖 → 打字 → 下載，早安圖晚安圖隨你做
        </p>

        <router-link
          to="/editor"
          class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <span class="text-base sm:text-lg font-semibold">開始製作</span>
          <svg
            class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </router-link>
      </div>

      <div
        class="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-6 sm:gap-8 lg:gap-12"
      >
        <div class="w-full lg:flex-1 order-2 lg:order-1 hidden sm:block">
          <div class="mb-4 sm:mb-6 flex items-center justify-center gap-2">
            <svg
              class="w-5 sm:w-6 h-5 sm:h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="2"
                y="3"
                width="20"
                height="14"
                rx="2"
                ry="2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="8"
                y1="21"
                x2="16"
                y2="21"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="12"
                y1="17"
                x2="12"
                y2="21"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-lg sm:text-xl font-semibold text-slate-900">桌面版</span>
          </div>
          <div class="relative group">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-blue-100 to-slate-100 rounded-2xl sm:rounded-3xl opacity-60 group-hover:opacity-100 blur-lg transition duration-500"
            ></div>
            <div
              class="relative bg-white rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div class="rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  :src="`${baseUrl}showcase/desktop.webp`"
                  alt="Desktop view"
                  class="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="w-full sm:w-auto order-1 lg:order-2">
          <div class="mb-4 sm:mb-6 flex items-center justify-center gap-2">
            <svg
              class="w-5 sm:w-6 h-5 sm:h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="5"
                y="2"
                width="14"
                height="20"
                rx="2"
                ry="2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="12"
                y1="18"
                x2="12.01"
                y2="18"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-lg sm:text-xl font-semibold text-slate-900">移動版</span>
          </div>
          <div class="relative group max-w-[200px] sm:max-w-[300px] mx-auto">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-slate-100 to-blue-100 rounded-[2rem] sm:rounded-[2.5rem] opacity-60 group-hover:opacity-100 blur-lg transition duration-500"
            ></div>
            <div
              class="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div class="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
                <img
                  :src="`${baseUrl}showcase/mobile.webp`"
                  alt="Mobile view"
                  class="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 sm:mt-16 grid grid-cols-3 gap-2 sm:gap-6">
        <div
          class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200"
        >
          <div
            class="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-md"
          >
            <svg
              class="w-5 sm:w-7 h-5 sm:h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">極速載入</h3>
          <p class="text-slate-600 text-xs sm:text-sm hidden sm:block">優化效能，瞬間啟動</p>
        </div>

        <div
          class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200"
        >
          <div
            class="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-md"
          >
            <svg
              class="w-5 sm:w-7 h-5 sm:h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
              />
            </svg>
          </div>
          <h3 class="text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">靈活佈局</h3>
          <p class="text-slate-600 text-xs sm:text-sm hidden sm:block">自動適應各種螢幕</p>
        </div>

        <div
          class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200"
        >
          <div
            class="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-md"
          >
            <svg
              class="w-5 sm:w-7 h-5 sm:h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <h3 class="text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">精美設計</h3>
          <p class="text-slate-600 text-xs sm:text-sm hidden sm:block">現代化視覺體驗</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = import.meta.env.BASE_URL

defineOptions({
  name: 'LandingPage',
})
</script>
