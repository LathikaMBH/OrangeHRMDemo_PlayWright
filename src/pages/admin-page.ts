import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class AdminPage extends BasePage {
  // Locators
  readonly adminHeader: Locator;
  readonly userManagementTab: Locator;
  readonly jobTab: Locator;
  readonly organizationTab: Locator;
  readonly qualificationsTab: Locator;
  readonly nationalitiesTab: Locator;
  readonly corporateBrandingTab: Locator;
  readonly configurationTab: Locator;
  readonly addUserButton: Locator;
  readonly usernameSearchInput: Locator;
  readonly userRoleDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.adminHeader = page.locator('h6:has-text("Admin")');
    this.userManagementTab = page.locator('a:has-text("User Management")');
    this.jobTab = page.locator('a:has-text("Job")');
    this.organizationTab = page.locator('a:has-text("Organization")');
    this.qualificationsTab = page.locator('a:has-text("Qualifications")');
    this.nationalitiesTab = page.locator('a:has-text("Nationalities")');
    this.corporateBrandingTab = page.locator('a:has-text("Corporate Branding")');
    this.configurationTab = page.locator('a:has-text("Configuration")');
    this.addUserButton = page.locator('button:has-text("Add")');
    this.usernameSearchInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.userRoleDropdown = page.locator('.oxd-select-text').first();
    this.employeeNameInput = page.locator('input[placeholder="Type for hints..."]').nth(1);
    this.statusDropdown = page.locator('.oxd-select-text').nth(1);
    this.searchButton = page.locator('button[type="submit"]');
  }

  // Methods
  async searchUser(username: string): Promise<void> {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
  }

  async addUser(userRole: string, employeeName: string, username: string, password: string): Promise<void> {
    await this.addUserButton.click();
    
    // Select user role
    await this.userRoleDropdown.click();
    await this.page.locator(`text=${userRole}`).click();
    
    // Type employee name
    await this.employeeNameInput.fill(employeeName);
    await this.page.locator(`text=${employeeName}`).click();
    
    // Fill username and password
    await this.page.locator('input[autocomplete="off"]').fill(username);
    await this.page.locator('input[type="password"]').first().fill(password);
    await this.page.locator('input[type="password"]').nth(1).fill(password);
    
    await this.page.locator('button[type="submit"]').click();
  }

  async navigateToJobTitles(): Promise<void> {
    await this.jobTab.click();
    await this.page.locator('a:has-text("Job Titles")').click();
  }

  async navigateToOrganizationStructure(): Promise<void> {
    await this.organizationTab.click();
    await this.page.locator('a:has-text("General Information")').click();
  }
}