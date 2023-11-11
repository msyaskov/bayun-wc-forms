import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {ViteAliases} from "vite-aliases";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true
  },
  server: {
    port: 8047,
  },
  plugins: [react(), ViteAliases({dir: './src', prefix: '~/', useAbsolute: true})],
})
