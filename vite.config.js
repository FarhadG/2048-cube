import { defineConfig } from 'vite';

export default defineConfig({
  base: '/2048-cube/',
  server: {
    port: 2048,
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'slash-div', 'global-builtin', 'color-functions', 'function-units'],
      },
    },
  },
});
