import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class DashboardPage extends BasePage {
  // Locators
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly sideNavigation: Locator;
  readonly quickLaunchPanel: Locator;
  readonly employeeDistributionChart: Locator;
  readonly leaveRequestsPending: Locator;
  readonly timesheetsPending: Locator;
  readonly myActions: Locator;
  readonly searchBox: Locator;
  readonly profilePicture: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('h6:has-text("Dashboard")');
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutOption = page.locator('a:has-text("Logout")');
    this.sideNavigation = page.locator('.oxd-sidepanel');
    this.quickLaunchPanel = page.locator('.orangehrm-quick-launch');
    this.employeeDistributionChart = page.locator('.emp-distrib-chart');
    this.leaveRequestsPending = page.locator('.orangehrm-dashboard-widget:has-text("Leave Requests")');
    this.timesheetsPending = page.locator('.orangehrm-dashboard-widget:has-text("Timesheets")');
    this.myActions = page.locator('.orangehrm-dashboard-widget:has-text("My Actions")');
    this.searchBox = page.locator('input[placeholder="Search"]');
    this.profilePicture = page.locator('.oxd-userdropdown-img');
  }

  // Methods
  async isDashboardVisible(): Promise<boolean> {
    return await this.dashboardHeader.isVisible();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutOption.click();
  }

  async clickUserDropdown(): Promise<void> {
    await this.userDropdown.click();
  }

  async navigateToModule(moduleName: string): Promise<void> {
    await this.page.locator(`a:has-text("${moduleName}")`).click();
  }

  async searchEmployee(employeeName: string): Promise<void> {
    await this.searchBox.fill(employeeName);
    await this.page.keyboard.press('Enter');
  }

  async getQuickLaunchOptions(): Promise<string[]> {
    const options = await this.quickLaunchPanel.locator('.oxd-glass-button').allTextContents();
    return options;
  }

  async getPendingLeaveRequests(): Promise<string> {
    return await this.leaveRequestsPending.locator('.orangehrm-dashboard-widget-body').textContent() || '';
  }

  async getPendingTimesheets(): Promise<string> {
    return await this.timesheetsPending.locator('.orangehrm-dashboard-widget-body').textContent() || '';
  }
}