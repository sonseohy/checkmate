import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, 
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,wasm,css,html,mjs}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [ /^\/pdf\.worker\.js$/, ],
        runtimeCaching: [
          {
            urlPattern: /^\/pdf\.worker\.js$/,
            handler: 'NetworkOnly',
            options: {
              // 필요하면 캐시 옵션 더 줄 수 있습니다.
              cacheName: 'pdf-worker-cache',
            },
          },
        ],
      },
      includeAssets: ['pdf.worker.js', 'icons/favicon.ico'],
      devOptions: {
        enabled: true, //개발 환경에서도 PWA가 정상적으로 작성하도록 설정
      },
      manifest: {
        name: 'Checkmate', //앱의 전체 이름
        short_name: 'Checkmate', //앱의 짧은 이름 - 홈 화면 아이콘 아래
        description: '여기에 슬로건이 들어갑니다.', // 앱에 대한 설명, 앱 스토어나 설치 화면에서 사용
        theme_color: '#ffffff', // 앱의 테마 색상, 브라우저 UI요소(주소 표시줄 등)의 색상
        background_color: '#ffffff', // 앱이 로딩되는 동안 표시될 배경 색상
        display: 'standalone', // 독립 실행 형태 (네이티브 앱처럼 보이게 함) - 브라우저 UI(주소 표시줄, 탭 등)를 숨겨 네티이브 앱처럼 보이게 함
        icons: [
          {
            src: '/icons/apple-touch-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon-128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon-196x196.png',
            sizes: '196x196',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon',
            purpose: 'any',
          },
          {
            src: '/icons/mstile-70x70.png',
            sizes: '70x70',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/mstile-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/mstile-150x150.png',
            sizes: '150x150',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/mstile-310x150.png',
            sizes: '310x150',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/mstile-310x310.png',
            sizes: '310x310',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  define: {
    global: 'window',
  }
  
});