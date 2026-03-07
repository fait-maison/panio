# Formatter & Linter Setup

## Tools

| Tool        | Package                                                                                       | Purpose                  |
| ----------- | --------------------------------------------------------------------------------------------- | ------------------------ |
| Prettier    | `prettier`, `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`                           | Formatting               |
| ESLint      | `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`, `eslint-config-prettier` | Linting (strict)         |
| Husky       | `husky`                                                                                       | Git pre-commit hooks     |
| lint-staged | `lint-staged`                                                                                 | Run on staged files only |

## Prettier Config (`.prettierrc`)

```json
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	"overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

## ESLint Config (`eslint.config.js`)

Flat config with:

- `@eslint/js` recommended
- `typescript-eslint/strict-type-checked`
- `eslint-plugin-svelte/recommended`
- `eslint-config-prettier` (disable formatting conflicts)
- Extra rules: `eqeqeq`, `no-console: warn`, `prefer-const`
- Ignore: `build/`, `.svelte-kit/`, `node_modules/`

## Scripts

```json
"lint": "eslint .",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

## lint-staged

```json
"lint-staged": {
  "*.{ts,svelte}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md,html}": ["prettier --write"]
}
```

## CI

Add `lint` job to `.github/workflows/docker-build.yml` before `test`:

- `pnpm run format:check`
- `pnpm run lint`
- `test` gets `needs: [lint]`

## Husky

`pnpm exec husky init` → `.husky/pre-commit` runs `pnpm exec lint-staged`

## Initial Formatting

One commit to auto-fix entire codebase. Create `.git-blame-ignore-revs` with that commit hash.
