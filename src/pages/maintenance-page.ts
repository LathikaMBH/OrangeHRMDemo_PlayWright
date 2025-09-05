import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class MaintenancePage extends BasePage {
  // Locators
  readonly maintenanceHeader: Locator;
  readonly passwordInput: Locator;
  readonly confirmButton: Locator;
  readonly purgeEmployeeRecords: Locator;
  readonly accessRecords: Locator;

  constructor(page: Page) {
    super(page);
    this.maintenanceHeader = page.locator('h6:has-text("Maintenance")');
    this.passwordInput = page.locator('input[type="password"]');
    this.confirmButton = page.locator('button:has-text("Confirm")');
    this.purgeEmployeeRecords = page.locator('a:has-text("Purge Employee Records")');
    this.accessRecords = page.locator('a:has-text("Access Records")');
  }

  // Methods
  async enterMaintenanceMode(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.confirmButton.click();
  }
}
