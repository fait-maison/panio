import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default ts.config(
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...svelte.configs['flat/recommended'],
	prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.js', 'svelte.config.js']
				},
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			eqeqeq: 'error',
			'no-console': 'warn',
			'prefer-const': 'error',
			'svelte/require-each-key': 'warn'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Svelte 5 runes: $derived/$state use `let` but are never reassigned
			'prefer-const': 'off',
			// Svelte event handlers: onclick={() => voidFn()} is idiomatic
			'@typescript-eslint/no-confusing-void-expression': 'off',
			// Svelte reactive statements may trigger this incorrectly
			'@typescript-eslint/no-unnecessary-condition': 'off'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'coverage/', 'playwright-report/', 'test-results/']
	}
);
