import { randomUUID } from "node:crypto";
import { ENV } from "../config/env";
import { type User } from "../models/user.model";

/**
 * Seeded accounts available to tests. Their credentials are configured through
 * the environment variables validated by `src/config/env.ts`.
 */
export type UserKind = keyof typeof ENV.users;

/**
 * Returns an email address that is unique across workers and runs, for tests
 * that register new accounts. Uses a random UUID rather than a timestamp, so
 * two tests starting in the same millisecond cannot collide.
 */
export function createUniqueEmail(): string {
  return `autotest_${randomUUID()}@example.com`;
}

/**
 * Builds a `User` using the given seeded account; pass `overrides` to replace
 * any of its default values.
 */
export function createUser(
  kind: UserKind = "empty",
  overrides: Partial<User> = {},
): User {
  const user = ENV.users[kind];
  return {
    email: overrides.email ?? user.email,
    password: overrides.password ?? user.password,
  };
}
