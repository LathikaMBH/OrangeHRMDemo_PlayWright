import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class AddEmployeePage extends BasePage {
  // Locators
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly profilePictureUpload: Locator;
  readonly createLoginCheckbox: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly statusDropdown: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input[class*="oxd-input"][placeholder]').nth(1);
    this.profilePictureUpload = page.locator('input[type="file"]');
    this.createLoginCheckbox = page.locator('input[type="checkbox"]');
    this.usernameInput = page.locator('input[autocomplete="off"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.statusDropdown = page.locator('.oxd-select-text');
    this.saveButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.successMessage = page.locator('.oxd-toast-content-text');
  }

  // Methods
  async addEmployee(firstName: string, middleName: string, lastName: string, employeeId?: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    
    if (employeeId) {
      await this.employeeIdInput.clear();
      await this.employeeIdInput.fill(employeeId);
    }
    
    await this.saveButton.click();
  }

  async addEmployeeWithLogin(
    firstName: string, 
    lastName: string, 
    username: string, 
    password: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.createLoginCheckbox.check();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.saveButton.click();
  }

  async uploadProfilePicture(filePath: string): Promise<void> {
    await this.profilePictureUpload.setInputFiles(filePath);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }
}