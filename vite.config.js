import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        residences: resolve(__dirname, 'residences.html'),
        business: resolve(__dirname, 'business.html'),
        retailSpaces: resolve(__dirname, 'retail-spaces.html'),
        ventes: resolve(__dirname, 'ventes.html'),
        maquette: resolve(__dirname, 'maquette3d.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about-the-investor.html'),
      },
    },
  },
});
