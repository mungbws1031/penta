import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.js'],
  },
});
