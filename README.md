# rolnopol-atf

Zestaw testów aplikacji Rolnopol napisany w Playwright i TypeScript.

## Wymagania

- Node.js i npm
- Aplikacja Rolnopol w katalogu `../test-repo/rolnopol` względem tego repozytorium. Playwright uruchamia ją automatycznie przez `npm start` i korzysta z `http://localhost:3000`.

## Instalacja

W katalogu tego repozytorium uruchom:

```sh
npm ci
npx playwright install chromium
```

## Uruchamianie testów

```sh
npm test
```

Aby uruchomić testy z widoczną przeglądarką:

```sh
npm run test:headed
```

Aby wyświetlić raport HTML po uruchomieniu testów:

```sh
npm run test:report
```

## Dokumentacja

- [Standardy kodowania](docs/coding-standards.md)
- [Plan testów](docs/test-plan.md)
