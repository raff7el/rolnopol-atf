import { type User } from "../models/user.model";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

/**
 * Builds a `User`. Default values come from the `TEST_USER_*` environment
 * variables; pass `overrides` to replace any of them.
 */
export function createUser(overrides: Partial<User> = {}): User {
  return {
    email: overrides.email ?? requireEnv("TEST_USER_EMAIL"),
    password: overrides.password ?? requireEnv("TEST_USER_PASSWORD"),
  };
}
