import { PlaywrightTestConfig, devices } from '@playwright/test';
import { EnvironmentManager } from './src/helpers/environment-manager';

// Initialize environment
const envManager = EnvironmentManager.getInstance();
const environment = process.env.TEST_ENV || 'dev';
envManager.loadEnvironment(environment);

const config: PlaywrightTestConfig = {
  // Test directory - using your original specs structure
  testDir: './tests/specs',
  
  // Global test timeout
  timeout: envManager.getTimeout() * 2,
  
  // Expect timeout
  expect: {
    timeout: envManager.getTimeout() / 3,
  },

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: envManager.getRetries(),
  workers: envManager.getWorkers(),

  // Base configuration
  use: {
    baseURL: envManager.getBaseUrl(),
    headless: envManager.isHeadless(),
    screenshot: 'only-on-failure',
    video: process.env.VIDEO_ON_FAILURE === 'true' ? 'retain-on-failure' : 'off',
    trace: process.env.TRACE_ON_FAILURE === 'true' ? 'retain-on-failure' : 'off',
    actionTimeout: envManager.getTimeout(),
  },

  // Reporter configuration - using your original reports structure
  reporter: [
    ['html', { 
      outputFolder: 'reports/html-report',
      open: process.env.REPORT_OPEN === 'true' ? 'always' : 'never'
    }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['line'],
  ],

  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Global setup using your original support structure
  globalSetup: './tests/support/global-setup.ts',
};

export default config;
