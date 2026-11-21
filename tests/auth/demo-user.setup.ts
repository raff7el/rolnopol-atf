import { expect, test as setup } from "@playwright/test";

import { STORAGE_STATE } from "../../src/config/auth";
import { PAGE_URLS } from "../../src/constants/pageurls";
import { createUser } from "../../src/factories/user.factory";
import { LoginPage } from "../../src/pages/login.page";

// AUTH-04: the demo user (TEST_DEMO_USER_* in .env) logs in through the UI;
// the API returns a token, auth cookies are set, and the user lands on the profile page.
// The resulting browser state is saved for the `demo-user` project, so if this
// login fails, the tests that need the session are skipped instead of each failing on its own.
setup(
  "logs in as the demo user, sets auth cookies, and saves the session",
  { tag: "@smoke" },
  async ({ page, context }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const user = createUser("demo");

    await loginPage.goto();
    await loginPage.fillForm(user);

    const getLoginResponse = await loginPage.captureLoginResponse();

    // Act
    await loginPage.submit();

    // Assert
    const { status, body } = await getLoginResponse();
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data?.user.email).toBe(user.email);
    expect(body.data?.token).toEqual(expect.any(String));
    expect(body.data?.token).not.toHaveLength(0);

    await expect(page).toHaveURL(PAGE_URLS.profile);

    const cookies = await context.cookies();
    const cookieNames = cookies.map((c) => c.name);
    expect(cookieNames).toEqual(
      expect.arrayContaining(["rolnopolToken", "rolnopolLoginTime"]),
    );

    // Save
    await context.storageState({ path: STORAGE_STATE.demo });
  },
);
