import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// --host (voir package.json) : l'appli est aussi joignable depuis un téléphone sur le même Wi-Fi
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 }
});
