import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './', // GitHub Pages 프로젝트 경로(/penta/)에서도 동작하도록 상대경로
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.js'],
  },
});
