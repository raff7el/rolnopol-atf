import { ENV } from "../config/env";
import { type User } from "../models/user.model";

/**
 * Builds a `User`. Default values come from `ENV.testUser`
 * (`TEST_USER_*` environment variables); pass `overrides` to replace any of them.
 */
export function createUser(overrides: Partial<User> = {}): User {
  return {
    email: overrides.email ?? ENV.testUser.email,
    password: overrides.password ?? ENV.testUser.password,
    displayName: overrides.displayName ?? ENV.testUser.displayName,
  };
}
