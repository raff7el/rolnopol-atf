# rolnopol-atf

Testy aplikacji Rolnopol w Playwright i TypeScript.

## Wymagania

- Node.js `24.22.3` (zgodnie z `.nvmrc`) i npm
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

| Projekt       | Katalog          | Opis                                                                                       |
| ------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `smoke-tests` | `tests/smoke/`   | Szybki test, czy aplikacja działa; bez logowania                                           |
| `setup`       | `tests/auth/`    | Logowanie DEMO_USER (AUTH-04), zapis sesji do `playwright/.auth/user.json`                 |
| `demo-user`   | `tests/session/` | Testy zalogowanego DEMO_USER; zależy od `setup`                                            |
| `ui`          | `tests/ui/`      | Scenariusze UI startujące bez sesji (rejestracja, logowanie innych użytkowników)           |

```sh
npx playwright test --project=smoke-tests   # tylko smoke
npx playwright test --project=demo-user     # setup + testy DEMO_USER
```

## Dokumentacja

- [Standardy kodowania](docs/coding-standards.md)
- [Plan testów](docs/test-plan.md)
