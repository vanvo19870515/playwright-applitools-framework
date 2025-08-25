import { test, expect } from '@playwright/test';
import {
    BatchInfo,
    Configuration,
    Eyes,
    VisualGridRunner,
    Target,
} from '@applitools/eyes-playwright';

// Cấu hình Applitools Eyes
const APPLITOOLS_API_KEY = process.env.APPLITOOLS_API_KEY || "97ESoLYn4nUwf1092dit1D63zabJ7CVzA4981BtrDYZDdDA110";
const batch = new BatchInfo('VIGO Retail Login');

test.describe('VIGO Retail Login Page - Visual Test', () => {
    let eyes: Eyes;
    let runner: VisualGridRunner;
    let config: Configuration;

    test.beforeAll(async () => {
        runner = new VisualGridRunner({ testConcurrency: 5 });
        config = new Configuration();
        config.setApiKey(APPLITOOLS_API_KEY);
        config.setBatch(batch);
        config.addBrowser(1200, 800, 'chrome');
        config.addBrowser(1200, 800, 'firefox');
        config.addBrowser(1200, 800, 'safari');
    });

    test.beforeEach(async ({ page }) => {
        eyes = new Eyes(runner, config);
        await eyes.open(
            page,
            'VIGO Retail',
            test.info().title,
            { width: 1280, height: 1024 }
        );
    });

    test('should log in and visually validate the home page', async ({ page }) => {
        await page.goto('https://oms-staging.vigoretail.com/');
        await eyes.check('Login Page', Target.window().fully());

        await page.locator('#username').fill('qa.admin@vigoretail.com');
        await page.locator('#password').fill('Aa123456');
        await page.locator('//*[@id="__next"]/div/div/div[2]/div[3]/form/div[3]/div/div/div/div/button').click();

        await expect(page.locator('text=QA Admin')).toBeVisible({ timeout: 30000 });
        await eyes.check('Home Page', Target.window().fully());
    });

    test.afterEach(async () => {
        await eyes.close();
    });

    test.afterAll(async () => {
        const results = await runner.getAllTestResults(false);
        console.log('Applitools test results:', results);
    });
});
