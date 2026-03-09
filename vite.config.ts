import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// VexFlow 3 uses CommonJS internally — must be bundled (not externalized) during SSR
	ssr: {
		noExternal: ['vexflow']
	}
});
