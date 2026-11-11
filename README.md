# rolnopol-atf

Testy aplikacji Rolnopol w Playwright i TypeScript.

## Wymagania

- Node.js i npm
- Aplikacja Rolnopol w `../test-repo/rolnopol` (Playwright uruchamia ją automatycznie przez `npm start`)

## Instalacja i uruchomienie

```sh
npm ci
npx playwright install chromium

npm test                # testy
npm run test:headed     # z widoczną przeglądarką
npm run test:report     # raport HTML
```

## Dokumentacja

- [Standardy kodowania](docs/coding-standards.md)
- [Plan testów](docs/test-plan.md)
