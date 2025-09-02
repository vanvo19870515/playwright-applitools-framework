import { Page, Locator, expect } from '@playwright/test';
import { Eyes, Target } from '@applitools/eyes-playwright';

export class HomePage {
    // --- Properties ---
    readonly page: Page;
    readonly qaAdminHeader: Locator;

    // --- Constructor ---
    constructor(page: Page) {
        this.page = page;
        this.qaAdminHeader = page.locator('text=QA Admin');
    }

    // --- Assertions ---
    async expectUserToBeLoggedIn() {
        await expect(this.qaAdminHeader).toBeVisible({ timeout: 30000 });
    }

    // --- Visual Validation ---
    async checkLayout(eyes: Eyes, stepName: string) {
        await eyes.check(stepName, Target.window().fully());
    }
}
