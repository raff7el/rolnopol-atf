/**
 * A Rolnopol user account as used by the tests.
 */
export interface User {
  email: string;
  password: string;
  /** Name shown on the profile page (`displayedName` in the API). */
  displayName: string;
}
