# Rolnopol – Test Plan

As of 2026-11-09 · Source: [Rolnopol documentation](http://localhost:3000/docs.html)

## Scope

This plan covers functional UI and API testing of Rolnopol, the farm management app at http://localhost:3000. Core flows come first; feature-flagged modules are tested only with their flag on and off.

**In scope**

- Registration, login, logout, session cookies and role-based access
- Farm resources: fields, animals, staff and assignments
- Marketplace: create, buy and cancel offers, plus offer statuses
- Finance: balance, transaction history, transfers, no-overdraft rule
- Health check endpoint and API basics (versioning, auth header, Swagger)
- Feature-flagged modules: Alerts, Severity Filter, Contact Form, Farm Map, Synthetic Monitoring, Survival game, WebMCP tools

**Out of scope**

- Performance and load testing (rate limits are checked only functionally)
- Security hardening: plain-text passwords and non-httpOnly cookies are documented demo choices
- Visual regression and cross-browser matrix beyond Chromium

## Test approach

All automated tests run in Playwright with TypeScript, split into a fast smoke suite and a fuller regression suite.

| Level | What it checks | How | When |
| --- | --- | --- | --- |
| Smoke | App is up, login works, key pages load | Playwright UI + `GET /api/v1/healthcheck` | Every commit |
| API | Endpoints, status codes, validation, business rules | Playwright `request` fixture against `/api/v1/*` | Every commit |
| UI functional | User flows through the pages | Playwright browser tests, page objects | Every PR |
| End-to-end | Multi-user scenarios (seller and buyer) | Two browser contexts or API setup + UI check | Nightly |
| Feature flags | Module visible and working when on; hidden or 404 when off | Toggle on the Feature Flags page or via API, then assert | Nightly |

- Set up test data through the API, then verify in the UI; this keeps UI tests short and stable.
- Use the Swagger UI at `/swagger.html` and the schema at `/public/schema/openapi.json` to cross-check request and response shapes.
- Tag tests `@smoke`, `@api`, `@e2e` and `@flag` so suites can be run separately.

## Test scenarios

40 scenarios across 7 areas; P1 runs on every commit, P2 nightly, P3 weekly. Expected results come straight from the documentation.

| ID | Area | Scenario | Expected result | Priority |
| --- | --- | --- | --- | --- |
| AUTH-01 | Auth | Register with unique email, display name and password | Account created, user logged in and redirected | P1 |
| AUTH-02 | Auth | Register with an email that already exists | 409 "User with this email already exists" | P1 |
| AUTH-03 | Auth | Register with invalid or missing fields | 400 "Validation failed: ..." | P2 |
| AUTH-04 | Auth | Log in with demo@example.com / demo123 | Token returned; cookies `rolnopolToken` and `rolnopolLoginTime` set; redirect to `/profile.html` | P1 |
| AUTH-05 | Auth | Log in with wrong password | 401 "Invalid credentials", user can retry | P1 |
| AUTH-06 | Auth | Log in with a deactivated account | 401 "Account is deactivated" | P2 |
| AUTH-07 | Auth | Call a protected endpoint with token as cookie, as Bearer header, and with none | Cookie and Bearer succeed; no token is rejected | P1 |
| AUTH-08 | Auth | Log out | Auth cookies cleared, old token no longer accepted | P1 |
| AUTH-09 | Auth | Repeat failed logins quickly | Rate limit kicks in | P3 |
| AUTH-10 | Auth | Farmer tries to open admin or superadmin features | Access denied | P1 |
| FARM-01 | Farm | Add a field with name and area | Field appears in the farm overview | P1 |
| FARM-02 | Farm | Edit and remove a field | Changes saved and reflected | P2 |
| FARM-03 | Farm | Add animals with type and amount, assign to a field | Animal listed with its fieldId | P1 |
| FARM-04 | Farm | Add staff with name and age | Staff member listed | P2 |
| FARM-05 | Farm | Assign staff to a field, then unassign | Assignment created, then removed | P1 |
| FARM-06 | Farm | Log in as emptyuser@rolnopol.demo.pl | Empty states shown, no errors | P3 |
| MKT-01 | Marketplace | Create an offer for an unassigned field | Offer status `active`, visible to other users | P1 |
| MKT-02 | Marketplace | Create an offer for an assigned field or animal | Offer status `unavailable` | P1 |
| MKT-03 | Marketplace | Offer the same asset twice | Second offer rejected | P2 |
| MKT-04 | Marketplace | User B buys User A's active offer | Funds moved, two financial transactions, ownership transferred, offer `sold` | P1 |
| MKT-05 | Marketplace | Seller tries to buy their own offer | Purchase blocked | P2 |
| MKT-06 | Marketplace | Buy with less money than the price | Blocked with "Insufficient funds: overdraft is not allowed." | P1 |
| MKT-07 | Marketplace | Seller cancels an active offer | Offer `cancelled`, no money moves | P2 |
| MKT-08 | Marketplace | Filter and search offers | Only matching offers shown | P3 |
| FIN-01 | Finance | View balance and transaction history | Values match the API | P1 |
| FIN-02 | Finance | Transfer funds to another user | Sender expense, receiver income, balances updated | P1 |
| FIN-03 | Finance | Transfer more than the balance | Rejected, balance unchanged | P1 |
| SYS-01 | System | `GET /api/v1/healthcheck` | Healthy status incl. database | P1 |
| SYS-02 | System | Open `/docs.html` and `/swagger.html` | Docs and Swagger load without errors | P3 |
| FF-01 | Alerts | `alertsEnabled` on, then off | On: page, nav link and `GET /alerts` work; off: nav hidden, API 404 | P2 |
| FF-02 | Alerts | Severity filter on and off | Dropdown filters by level; hidden and cleared when off | P3 |
| FF-03 | Contact | Submit valid form; then turn flag off | Confirmation shown; off: notice shown, `POST /api/contact` 404 | P2 |
| FF-04 | Farm Map | `rolnopolMapEnabled` on, logged in and logged out | Map nav and page shown; `/map` endpoints need login | P3 |
| FF-05 | Synthetic | Send `X-Synthetic-Test` only, valid token, wrong token | Response header `synthetic`, `synthetic_verified`, `synthetic`; `X-Synthetic-Verified` matches | P3 |
| FF-06 | Survival | Flag off; flag on without session; with `x-api-key` only; with session | 404; 401 or redirect to `/login.html`; 401; works | P3 |
| FF-07 | Survival | Start, snapshot and close an expedition | Session stored; snapshot over 256 KB rejected | P3 |
| FF-08 | WebMCP | Call `rolnopol.marketplace.buyOffer` | Confirmation dialog before purchase; cancel returns `user_cancelled` | P3 |
| FF-09 | WebMCP | Call a tool with an expired session or bad input | `not_authenticated` or `invalid_input`, no redirect | P3 |
| E2E-01 | End-to-end | Register, then set up a farm with field, animals and staff | All resources shown in the farm overview | P1 |
| E2E-02 | End-to-end | User A sells a field, User B buys it | Ownership and both balances updated | P1 |

## Environment, data and criteria

Tests run against a local instance at http://localhost:3000 in Chromium, using the documented demo accounts plus users created per test.

| Account | Password | Use in tests |
| --- | --- | --- |
| demo@example.com | demo123 | Main farmer with sample fields, staff, animals and money |
| test@example.com | brownPass123 | Second farmer, buyer in marketplace tests |
| john.doe@example.com | johndoe123 | Third farmer for transfers |
| emptyuser@rolnopol.demo.pl | demoPass123 | Empty states, insufficient funds |

- Tests that change data (buy, transfer, sell) use freshly registered users, so demo accounts stay stable.
- Feature flags are reset to their default after each flag test.
- `SYNTHETIC_TOKEN` is set in `.env` for the synthetic monitoring tests.

**Entry criteria:** app starts, healthcheck returns healthy, demo accounts can log in.

**Exit criteria:** 100% of P1 tests pass, at least 95% of P2 pass, and no open critical or high defects.

## Risks

The biggest risk is money and ownership going out of sync during a marketplace sale, so those tests get the most attention.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Sale leaves balances, ownership or offer status inconsistent | High | MKT-04 and E2E-02 assert all four records after every purchase |
| Shared demo data changed by parallel tests | Medium | Create users per test; run data-changing tests serially |
| Feature flag left on or off by a failed test | Medium | Reset flags in teardown |
| Login rate limit blocks the suite | Medium | Reuse a stored auth state instead of logging in per test |
| Chaos Engine injects latency or errors | Low | Keep it off for regression runs; enable only for monitoring tests |
| Docs and behaviour drift apart | Low | Report mismatches as defects against the docs or the app |
