import path from "node:path";

/**
 * Files holding a logged-in browser state (cookies + localStorage), written by
 * the `setup` project and loaded through `use.storageState` by the projects
 * that depend on it. Absolute, so they resolve the same from any cwd.
 * The folder is git-ignored.
 */
export const STORAGE_STATE = {
  demo: path.resolve(__dirname, "../../playwright/.auth/user.json"),
} as const;
