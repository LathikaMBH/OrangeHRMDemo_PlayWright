import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class PerformancePage extends BasePage {
  // Locators
  readonly performanceHeader: Locator;
  readonly configureTab: Locator;
  readonly manageReviewsTab: Locator;
  readonly myReviewsTab: Locator;
  readonly reviewListTab: Locator;
  readonly employeeReviewsTab: Locator;
  readonly addReviewButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.performanceHeader = page.locator('h6:has-text("Performance")');
    this.configureTab = page.locator('a:has-text("Configure")');
    this.manageReviewsTab = page.locator('a:has-text("Manage Reviews")');
    this.myReviewsTab = page.locator('a:has-text("My Reviews")');
    this.reviewListTab = page.locator('a:has-text("Review List")');
    this.employeeReviewsTab = page.locator('a:has-text("Employee Reviews")');
    this.addReviewButton = page.locator('button:has-text("Add")');
    this.searchButton = page.locator('button[type="submit"]');
  }

  // Methods
  async navigateToMyReviews(): Promise<void> {
    await this.myReviewsTab.click();
  }

  async navigateToReviewList(): Promise<void> {
    await this.reviewListTab.click();
  }

  async addPerformanceReview(): Promise<void> {
    await this.addReviewButton.click();
  }
}
