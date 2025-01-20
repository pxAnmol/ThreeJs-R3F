import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    glsl({
      include: '**/*.glsl', // Process .glsl files
      exclude: 'node_modules/**', // Ignore node_modules
    }),
  ],
});
