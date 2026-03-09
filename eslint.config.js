import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.strict,
	prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			eqeqeq: 'error',
			'no-console': 'warn',
			'prefer-const': 'error'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'coverage/', 'playwright-report/', 'test-results/']
	}
);
