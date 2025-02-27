import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      exclude: ['**/__test__/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: false,
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@mohibalkal/smovproviders',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        'crypto-js',
        'nanoid',
        'cheerio',
        'hls-parser',
        'set-cookie-parser',
      ],
      output: {
        globals: {
          'crypto-js': 'CryptoJS',
          'nanoid': 'nanoid',
          'cheerio': 'cheerio',
          'hls-parser': 'hlsParser',
          'set-cookie-parser': 'setCookie',
        },
      },
    },
  },
});
