import dotenv from "dotenv";
import path from "path";

/**
 * Single source of truth for environment variables.
 *
 * Local values live in `.env` (git-ignored, see `.env.example`).
 * In CI they come from the workflow `env:` block.
 *
 * Imported by `playwright.config.ts`, so validation runs before any test starts.
 * Read env values only through `ENV` - never use `process.env` elsewhere.
 */
dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const REQUIRED_VARS = ["BASE_URL", "TEST_USER_EMAIL", "TEST_USER_PASSWORD"] as const;

type RequiredVar = (typeof REQUIRED_VARS)[number];

function loadRequired(): Record<RequiredVar, string> {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing or empty environment variable(s): ${missing.join(", ")}. ` +
        "Copy .env.example to .env and fill it in (in CI, set them in the workflow env).",
    );
  }
  return Object.fromEntries(
    REQUIRED_VARS.map((name) => [name, process.env[name]!.trim()]),
  ) as Record<RequiredVar, string>;
}

const required = loadRequired();

export const ENV = Object.freeze({
  baseUrl: required.BASE_URL,
  testUser: Object.freeze({
    email: required.TEST_USER_EMAIL,
    password: required.TEST_USER_PASSWORD,
  }),
  /** Optional: set by CI providers; any non-empty value means "running in CI". */
  isCI: !!process.env.CI,
});
