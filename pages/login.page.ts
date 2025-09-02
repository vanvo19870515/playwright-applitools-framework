import { Page, Locator, expect } from '@playwright/test';
import { Eyes, Target } from '@applitools/eyes-playwright';

export class LoginPage {
    // --- Properties ---
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    // --- Constructor ---
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('//*[@id="__next"]/div/div/div[2]/div[3]/form/div[3]/div/div/div/div/button');
    }

    // --- Actions ---
    async goto() {
        await this.page.goto('https://oms-staging.vigoretail.com/');
    await this.page.goto('https://oms-staging.vigoretail.com/');}

    async login(username: string, password_val: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password_val);
        await this.loginButton.click();
    }

    // --- Visual Validation ---
    async checkLayout(eyes: Eyes, stepName: string) {
        await eyes.check(stepName, Target.window().fully());
    }
}
