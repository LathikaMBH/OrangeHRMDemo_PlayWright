import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class MyInfoPage extends BasePage {
  // Locators
  readonly myInfoHeader: Locator;
  readonly personalDetailsTab: Locator;
  readonly contactDetailsTab: Locator;
  readonly emergencyContactsTab: Locator;
  readonly dependentsTab: Locator;
  readonly immigrationTab: Locator;
  readonly jobTab: Locator;
  readonly salaryTab: Locator;
  readonly taxExemptionsTab: Locator;
  readonly qualificationsTab: Locator;
  readonly membershipsTab: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly otherIdInput: Locator;
  readonly licenseNumberInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myInfoHeader = page.locator('h6:has-text("PIM")');
    this.personalDetailsTab = page.locator('a:has-text("Personal Details")');
    this.contactDetailsTab = page.locator('a:has-text("Contact Details")');
    this.emergencyContactsTab = page.locator('a:has-text("Emergency Contacts")');
    this.dependentsTab = page.locator('a:has-text("Dependents")');
    this.immigrationTab = page.locator('a:has-text("Immigration")');
    this.jobTab = page.locator('a:has-text("Job")');
    this.salaryTab = page.locator('a:has-text("Salary")');
    this.taxExemptionsTab = page.locator('a:has-text("Tax Exemptions")');
    this.qualificationsTab = page.locator('a:has-text("Qualifications")');
    this.membershipsTab = page.locator('a:has-text("Memberships")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input').nth(3);
    this.otherIdInput = page.locator('input').nth(4);
    this.licenseNumberInput = page.locator('input').nth(5);
    this.saveButton = page.locator('button[type="submit"]').first();
  }

  // Methods
  async updatePersonalDetails(firstName: string, middleName: string, lastName: string): Promise<void> {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.clear();
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

  async navigateToContactDetails(): Promise<void> {
    await this.contactDetailsTab.click();
  }

  async navigateToEmergencyContacts(): Promise<void> {
    await this.emergencyContactsTab.click();
  }

  async navigateToQualifications(): Promise<void> {
    await this.qualificationsTab.click();
  }

  async getEmployeeId(): Promise<string> {
    return await this.employeeIdInput.inputValue();
  }
}
