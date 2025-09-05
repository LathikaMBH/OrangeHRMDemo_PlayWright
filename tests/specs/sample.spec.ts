import { test, expect } from '@playwright/test';
import { SamplePage } from './sample-page';
import { EnvironmentManager } from '../../src/helpers/environment-manager';

test.describe('Sample Test Suite', () => {
  let samplePage: SamplePage;
  let envManager: EnvironmentManager;

  test.beforeAll(async () => {
    envManager = EnvironmentManager.getInstance();
    envManager.loadEnvironment(process.env.TEST_ENV || 'dev');
  });

  test.beforeEach(async ({ page }) => {
    samplePage = new SamplePage(page);
    await samplePage.navigateToUrl('/');
  });

  test('should load the page successfully', async () => {
    const currentUrl = await samplePage.getCurrentUrl();
    const pageTitle = await samplePage.getPageTitle();
    
    expect(currentUrl).toContain(envManager.getBaseUrl());
    expect(pageTitle).toBeTruthy();
    
    // Take screenshot for verification
    await samplePage.takeScreenshot('page-loaded');
  });

  test('should display login form elements', async () => {
    const isFormVisible = await samplePage.isLoginFormVisible();
    expect(isFormVisible).toBe(true);
  });

  test('should perform valid user login', async () => {
    await samplePage.login('validUser');
    
    // Add your assertions here based on successful login behavior
  });

  test('should show error for invalid login', async () => {
    await samplePage.login('invalidUser');
    
    const isErrorDisplayed = await samplePage.isErrorDisplayed();
    expect(isErrorDisplayed).toBe(true);
    
    const errorMessage = await samplePage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('should handle custom credentials', async () => {
    await samplePage.loginWithCredentials('custom@test.com', 'custompass');
    
    // Add assertions based on your application behavior
  });
});
