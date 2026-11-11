# rolnopol-atf

Playwright tests for the Rolnopol application.

## Setup

Install dependencies:

```sh
npm ci
```

Tests start the application with `npm start` from `../test-repo/rolnopol` and use `http://localhost:3000`. Make sure the application is available at that path.

Run the tests:

```sh
npm test
```

For headed tests, run `npm run test:headed`. To open the HTML report after a run, use `npm run test:report`.

See the [test plan](docs/test-plan.md) and [coding standards](docs/coding-standards.md) for details.