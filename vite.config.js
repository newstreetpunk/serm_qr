import { defineConfig, splitVendorChunkPlugin } from 'vite'
import liveReload from 'vite-plugin-live-reload'
// import postcss from 'vite-plugin-postcss';
import path from "path";

export default defineConfig({
    plugins: [
        // vue(),
        liveReload([
          // edit live reload paths according to your source code
          // for example:
          // __dirname + '../(app|config|views)/**/*.html',
          // using this for our example:
          __dirname + './inc/**/*.php',
          __dirname + './inc/**/*.json',
          __dirname + './*.html',
        ]),
        // splitVendorChunkPlugin(),
      ],
  base: '/',
  build: {
    outDir: path.resolve(__dirname, '_site'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        employee_page: path.resolve(__dirname, 'employee-page.html'),
        classified: path.resolve(__dirname, 'classified.html'),
        recommendation: path.resolve(__dirname, 'recommendation.html'),
        script: path.resolve(__dirname, 'js/main.js'),
        style: path.resolve(__dirname, 'sass/main.scss'),
      }
    }
  },
//   plugins: [
//     postcss({
//         plugins: [
//             require('bootstrap'),
//             require('autoprefixer'),
//             require('sass')({
//                 includePaths: ['./sass'], // Укажите папку с вашими Sass/SCSS-файлами
//             }),
//         ],
//     }),
//   ],
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
    strictPort: true,
    port: 5133,
    host: true
  }
})