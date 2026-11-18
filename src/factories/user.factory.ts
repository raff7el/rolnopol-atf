import { randomUUID } from "node:crypto";
import { type User } from "../models/user.model";

/**
 * Seeded accounts available to tests, mapped to their environment variable prefix.
 * Each prefix expects `<PREFIX>_EMAIL` and `<PREFIX>_PASSWORD` to be set.
 */
const USER_ENV_PREFIXES = {
  /** emptyuser – no farm data, used for empty states. */
  empty: "TEST_EMPTY_USER",
  /** demo – main farmer with sample fields, staff, animals and money. */
  demo: "TEST_DEMO_USER",
} as const;

export type UserKind = keyof typeof USER_ENV_PREFIXES;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

/**
 * Returns an email address that is unique across workers and runs, for tests
 * that register new accounts. Uses a random UUID rather than a timestamp, so
 * two tests starting in the same millisecond cannot collide.
 */
export function createUniqueEmail(): string {
  return `autotest_${randomUUID()}@example.com`;
}

/**
 * Builds a `User`. Default values come from the `<PREFIX>_*` environment
 * variables of the given `kind` (see `USER_ENV_PREFIXES`); pass `overrides`
 * to replace any of them.
 */
export function createUser(kind: UserKind = "empty", overrides: Partial<User> = {}): User {
  const prefix = USER_ENV_PREFIXES[kind];
  return {
    email: overrides.email ?? requireEnv(`${prefix}_EMAIL`),
    password: overrides.password ?? requireEnv(`${prefix}_PASSWORD`),
  };
}
