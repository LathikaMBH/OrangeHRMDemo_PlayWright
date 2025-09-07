import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page'; // Adjust the path if necessary

export class PIMPage extends BasePage {
  // Locators
  readonly pimHeader: Locator;
  readonly addEmployeeButton: Locator;
  readonly employeeListTab: Locator;
  readonly addEmployeeTab: Locator;
  readonly reportsTab: Locator;
  readonly employeeIdInput: Locator;
  readonly employeeNameInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly employeeRecordsTable: Locator;
readonly recordsFoundText: Locator;

  constructor(page: Page) {
    super(page);
    this.pimHeader = page.locator('h6:has-text("PIM")');
    this.addEmployeeButton = page.locator('button:has-text("Add")');
    this.employeeListTab = page.locator('a:has-text("Employee List")');
    this.addEmployeeTab = page.locator('a:has-text("Add Employee")');
    this.reportsTab = page.locator('a:has-text("Reports")');
    this.employeeIdInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.employeeNameInput = page.locator('input[placeholder="Type for hints..."]').nth(1);
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.employeeRecordsTable = page.locator('.oxd-table-body');
    this.recordsFoundText = page.locator('.orangehrm-horizontal-padding span');
  }

  // Methods
  async searchEmployeeById(employeeId: string): Promise<void> {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
  }

  async searchEmployeeByName(employeeName: string): Promise<void> {
    await this.employeeNameInput.fill(employeeName);
    await this.searchButton.click();
  }

  async clickAddEmployee(): Promise<void> {
    await this.addEmployeeButton.click();
  }

  async resetSearch(): Promise<void> {
    await this.resetButton.click();
  }

  async getRecordsFoundCount(): Promise<string> {
    return await this.recordsFoundText.textContent() || '';
  }

  async getEmployeeTableData(): Promise<string[][]> {
    const rows = await this.employeeRecordsTable.locator('.oxd-table-row').all();
    const data: string[][] = [];
    
    for (const row of rows) {
      const cells = await row.locator('.oxd-table-cell').allTextContents();
      data.push(cells);
    }
    
    return data;
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await this.searchEmployeeById(employeeId);
    await this.page.locator(`tr:has-text("${employeeId}") .oxd-icon-button:has(.bi-trash)`).click();
    await this.page.locator('button:has-text("Yes, Delete")').click();
  }
}