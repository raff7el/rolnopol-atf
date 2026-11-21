# rolnopol-atf

Testy aplikacji Rolnopol w Playwright i TypeScript.

## Wymagania

- Node.js `24.22.3` (zgodnie z `.nvmrc`, używany też w CI) i npm; obsługiwany zakres: `^22.22.1 || >=24` (`package.json#engines`, minimum wymagane przez ESLint 10 i lint-staged 17)
- Aplikacja Rolnopol w `../test-repo/rolnopol` (Playwright uruchamia ją automatycznie przez `npm start`)

## Instalacja i uruchomienie

```sh
npm ci
npx playwright install chromium

npm test                # testy
npm run test:headed     # z widoczną przeglądarką
npm run test:report     # raport HTML
```

## Projekty Playwright

| Projekt       | Katalog          | Opis                                                                             |
| ------------- | ---------------- | -------------------------------------------------------------------------------- |
| `smoke-tests` | `tests/smoke/`   | Szybki test, czy aplikacja działa; bez logowania                                 |
| `setup`       | `tests/auth/`    | Logowanie DEMO_USER (AUTH-04), zapis sesji do `playwright/.auth/user.json`       |
| `demo-user`   | `tests/session/` | Testy zalogowanego DEMO_USER; zależy od `setup`                                  |
| `ui`          | `tests/ui/`      | Scenariusze UI startujące bez sesji (rejestracja, logowanie innych użytkowników) |

```sh
npx playwright test --project=smoke-tests   # tylko smoke
npx playwright test --project=demo-user     # setup + testy DEMO_USER
```

## Jakość kodu (analiza statyczna)

Przed commitem uruchom `npm run check`, który naprawia wszystko, co da się naprawić automatycznie.

| Skrypt                 | Co robi                                                        | Zmienia pliki? | CI  |
| ---------------------- | -------------------------------------------------------------- | -------------- | --- |
| `npm run check`        | Lokalnie: `lint:fix` → `format` → `tsc:check`                  | Tak            | Nie |
| `npm run check:ci`     | To samo co CI: `format:check` → `lint` → `tsc:check`           | Nie            | Tak |
| `npm run format`       | Prettier `--write` dla całego repo                             | Tak            | Nie |
| `npm run format:check` | Prettier `--check` dla całego repo (także `*.ts`)              | Nie            | Tak |
| `npm run lint`         | ESLint, błąd przy każdym ostrzeżeniu (`--max-warnings=0`)      | Nie            | Tak |
| `npm run lint:fix`     | ESLint `--fix` (m.in. sortuje importy)                         | Tak            | Nie |
| `npm run tsc:check`    | `tsc --noEmit` ze `strict` (Playwright sam nie sprawdza typów) | Nie            | Tak |

**Podział odpowiedzialności**

- **Prettier** odpowiada za formatowanie wszystkich plików, także `*.ts` (`.prettierrc.json`). `eslint-config-prettier` wyłącza w ESLint reguły, które by się z nim kłóciły.
- **ESLint** (`eslint.config.mjs`, flat config) sprawdza jakość kodu: `typescript-eslint`, `eslint-plugin-playwright` i kolejność importów (`eslint-plugin-simple-import-sort`, a nie Prettier ani `source.organizeImports` w VS Code). Pilnuje też zasad projektu:
  - brak `expect` w Page Objectach (`src/pages/**`),
  - `process.env` tylko w `src/config/env.ts` (reszta kodu czyta zmienne przez `ENV`).
- **TypeScript** (`tsconfig.json`) sprawdza typy w trybie `strict`, bez emisji plików.
- **Kolejność ma znaczenie:** najpierw `eslint --fix`, potem Prettier. Sortowanie importów nie poprawia odstępów (`{ expect,test }`), robi to dopiero Prettier. Tak samo działają `check`, hook i VS Code.

**Hook pre-commit (Husky)** instaluje się sam przy `npm install` / `npm ci` (skrypt `prepare`). Uruchamia:

1. `lint-staged` tylko na plikach w stage: `*.{ts,mjs}` → `eslint --fix`, potem `prettier --write`; `*.{json,md,yml,yaml}` → `prettier --write`,
2. `npm run tsc:check` na całym projekcie (~4 s).

Hook można obejść (`--no-verify`), dlatego rozstrzyga **CI**: job `quality` w `.github/workflows/playwright-tests.yml` uruchamia `format:check`, `lint` i `tsc:check`, a testy Playwright (`test`) startują dopiero po jego przejściu.

**Pomijane pliki:** `package-lock.json` (generowany przez npm) oraz wyniki i pliki tymczasowe: `playwright-report/`, `test-results/`, `blob-report/`, `playwright/.auth|.cache/`, `.playwright-mcp/`, `.ai-temp/`. Prettier dodatkowo respektuje `.gitignore`.

**VS Code:** przy zapisie najpierw `source.fixAll.eslint`, potem formatowanie Prettierem. Zalecane rozszerzenia są w `.vscode/extensions.json`.

**`git blame`:** commity z masowym formatowaniem są wymienione w `.git-blame-ignore-revs`. GitHub pomija je sam, lokalnie włącz to poleceniem `git config blame.ignoreRevsFile .git-blame-ignore-revs`.

## Dokumentacja

- [Standardy kodowania](docs/coding-standards.md)
- [Plan testów](docs/test-plan.md)
