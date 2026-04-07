import { defineConfig } from 'vite';

export default defineConfig({
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
