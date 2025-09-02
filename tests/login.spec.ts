import { test } from '@playwright/test';
import {
    BatchInfo,
    Configuration,
    Eyes,
    VisualGridRunner,
} from '@applitools/eyes-playwright';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

// Cấu hình Applitools Eyes
const APPLITOOLS_API_KEY = process.env.APPLITOOLS_API_KEY || "97ESoLYn4nUwf1092dit1D63zabJ7CVzA4981BtrDYZDdDA110";
const batch = new BatchInfo('VIGO Retail Login - POM');

test.describe('VIGO Retail Login Page - POM', () => {
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
        // 1. Khởi tạo các Page Objects
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        
        // 2. Mở trang và kiểm tra giao diện trang Login
        await loginPage.goto();
        await loginPage.checkLayout(eyes, 'Login Page');

        // 3. Thực hiện đăng nhập
        await loginPage.login('qa.admin@vigoretail.com', 'Aa123456');

        // 4. Kiểm tra chức năng và giao diện trang Home
        await homePage.expectUserToBeLoggedIn();
        await homePage.checkLayout(eyes, 'Home Page');
    });

    test.afterEach(async () => {
        await eyes.close();
    });

    test.afterAll(async () => {
        const results = await runner.getAllTestResults(false);
        console.log('Applitools test results:', results);
    });
});
