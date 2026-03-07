# Formatter & Linter Setup — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Prettier + ESLint (strict) with pre-commit hooks and CI enforcement.

**Architecture:** Prettier handles all formatting. ESLint handles code quality with strict TypeScript rules. Husky + lint-staged enforce on commit. CI validates in pipeline.

**Tech Stack:** Prettier, ESLint 9 (flat config), typescript-eslint (strict-type-checked), eslint-plugin-svelte, eslint-config-prettier, husky, lint-staged

---

### Task 1: Install Prettier

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `package.json` (add scripts + devDependencies)

**Step 1: Install packages**

```bash
pnpm add -D prettier prettier-plugin-svelte prettier-plugin-tailwindcss
```

**Step 2: Create `.prettierrc`**

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

**Step 3: Create `.prettierignore`**

```
build/
.svelte-kit/
coverage/
playwright-report/
test-results/
pnpm-lock.yaml
```

**Step 4: Add scripts to `package.json`**

Add to `"scripts"`:
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

**Step 5: Verify Prettier works**

```bash
pnpm run format:check
```

Expected: may show files to format (that's fine — we'll format everything in Task 4).

**Step 6: Commit**

```bash
git add .prettierrc .prettierignore package.json pnpm-lock.yaml
git commit -m "🔧 add prettier with svelte + tailwind plugins"
```

---

### Task 2: Install ESLint

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json` (add script + devDependencies)

**Step 1: Install packages**

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-svelte eslint-config-prettier globals
```

**Step 2: Create `eslint.config.js`**

```js
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
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
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
		}
	},
	{
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
```

**Step 3: Add script to `package.json`**

Add to `"scripts"`:
```json
"lint": "eslint .",
"lint:fix": "eslint --fix ."
```

**Step 4: Run ESLint and assess errors**

```bash
pnpm run lint 2>&1 | head -80
```

Expected: errors and warnings. Review them to determine if any rules need to be disabled or adjusted for this codebase. Common issues with strict-type-checked in Svelte:
- `@typescript-eslint/no-unsafe-*` in templates — may need ignoring in svelte settings
- `@typescript-eslint/no-unnecessary-condition` — reactive statements may trigger this
- `@typescript-eslint/restrict-template-expressions` — template string interpolation

**Step 5: Adjust config based on errors**

Add rule overrides or `settings.svelte.ignoreWarnings` as needed for legitimate patterns.
Do NOT disable rules just to make things pass — only disable for genuine false positives.

**Step 6: Verify ESLint passes (or only has fixable issues)**

```bash
pnpm run lint
```

Expected: PASS or only auto-fixable warnings.

**Step 7: Commit**

```bash
git add eslint.config.js package.json pnpm-lock.yaml
git commit -m "🔧 add eslint with strict typescript + svelte rules"
```

---

### Task 3: Fix ESLint errors in codebase

**Files:**
- Modify: any `.ts` / `.svelte` files flagged by ESLint

**Step 1: Auto-fix what ESLint can handle**

```bash
pnpm run lint:fix
```

**Step 2: Fix remaining manual errors**

Review remaining errors and fix them. Typical fixes:
- Add type annotations where required
- Replace `any` with proper types
- Add missing return types

**Step 3: Verify clean**

```bash
pnpm run lint
```

Expected: PASS with 0 errors. Warnings are OK.

**Step 4: Verify existing tests still pass**

```bash
pnpm run check && pnpm run test && pnpm run test:e2e
```

Expected: all pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "🔧 fix eslint errors across codebase"
```

---

### Task 4: Format entire codebase

**Files:**
- Modify: all `.ts`, `.svelte`, `.css`, `.json`, `.md`, `.html` files

**Step 1: Run Prettier on everything**

```bash
pnpm run format
```

**Step 2: Verify format check passes**

```bash
pnpm run format:check
```

Expected: PASS.

**Step 3: Verify lint still passes after formatting**

```bash
pnpm run lint
```

Expected: PASS (eslint-config-prettier prevents conflicts).

**Step 4: Verify tests still pass**

```bash
pnpm run check && pnpm run test && pnpm run test:e2e
```

Expected: all pass.

**Step 5: Commit formatting**

```bash
git add -A
git commit -m "🎨 format entire codebase with prettier"
```

**Step 6: Create `.git-blame-ignore-revs`**

```bash
HASH=$(git rev-parse HEAD)
echo -e "# Prettier initial formatting\n$HASH" > .git-blame-ignore-revs
git config blame.ignoreRevsFile .git-blame-ignore-revs
git add .git-blame-ignore-revs
git commit -m "🔧 add .git-blame-ignore-revs for formatting commit"
```

---

### Task 5: Add pre-commit hook (husky + lint-staged)

**Files:**
- Modify: `package.json` (add lint-staged config + devDependencies)
- Create: `.husky/pre-commit`

**Step 1: Install packages**

```bash
pnpm add -D husky lint-staged
```

**Step 2: Init husky**

```bash
pnpm exec husky init
```

This creates `.husky/pre-commit` with `npm test` — we'll replace it.

**Step 3: Set pre-commit hook content**

Write `.husky/pre-commit`:
```bash
pnpm exec lint-staged
```

**Step 4: Add lint-staged config to `package.json`**

Add top-level key:
```json
"lint-staged": {
  "*.{ts,svelte}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md,html}": ["prettier --write"]
}
```

**Step 5: Test the hook**

Make a trivial whitespace change to any file, stage it, and commit:
```bash
echo "" >> src/lib/utils.ts
git add src/lib/utils.ts
git commit -m "test: verify pre-commit hook"
```

Expected: lint-staged runs Prettier + ESLint on the staged file. Commit succeeds.

Then undo the test commit:
```bash
git reset HEAD~1
git checkout src/lib/utils.ts
```

**Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .husky/
git commit -m "🔧 add husky + lint-staged pre-commit hook"
```

---

### Task 6: Add CI lint job

**Files:**
- Modify: `.github/workflows/docker-build.yml`

**Step 1: Add `lint` job before `test`**

Add this job before the existing `test` job:

```yaml
  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Format check
        run: pnpm run format:check

      - name: Lint
        run: pnpm run lint
```

**Step 2: Add `needs: lint` to `test` job**

Change `test` job to:
```yaml
  test:
    runs-on: ubuntu-latest
    needs: lint
```

**Step 3: Verify YAML is valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/docker-build.yml'))" && echo "valid"
```

Expected: `valid`

**Step 4: Commit**

```bash
git add .github/workflows/docker-build.yml
git commit -m "🔧 add lint job to CI pipeline"
```

---

### Task 7: Update docs

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update CLAUDE.md**

Add to Commands section:
```
pnpm run lint         # eslint (strict typescript + svelte)
pnpm run lint:fix     # eslint with auto-fix
pnpm run format       # prettier (write)
pnpm run format:check # prettier (check only)
```

Add to Conventions section:
```
- **Formatting:** Prettier runs on commit via lint-staged. Run `pnpm run format` to format all files.
- **Linting:** ESLint strict-type-checked. Run `pnpm run lint` to check, `pnpm run lint:fix` to auto-fix.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "📝 document formatter & linter in CLAUDE.md"
```
