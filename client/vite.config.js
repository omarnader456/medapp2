import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    // Enable HTTPS for the frontend
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../server.cert')),
    },
    // Ensure it runs on the port we expect
    port: 5173,
  }
})