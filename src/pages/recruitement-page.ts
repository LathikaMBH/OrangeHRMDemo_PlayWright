import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class RecruitmentPage extends BasePage {
  // Locators
  readonly recruitmentHeader: Locator;
  readonly candidatesTab: Locator;
  readonly vacanciesTab: Locator;
  readonly addCandidateButton: Locator;
  readonly addVacancyButton: Locator;
  readonly candidateNameInput: Locator;
  readonly emailInput: Locator;
  readonly contactNumberInput: Locator;
  readonly resumeUpload: Locator;
  readonly keywordsInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.recruitmentHeader = page.locator('h6:has-text("Recruitment")');
    this.candidatesTab = page.locator('a:has-text("Candidates")');
    this.vacanciesTab = page.locator('a:has-text("Vacancies")');
    this.addCandidateButton = page.locator('button:has-text("Add")');
    this.addVacancyButton = page.locator('button:has-text("Add")');
    this.candidateNameInput = page.locator('input[name="candidateName"]');
    this.emailInput = page.locator('input[placeholder="Type here"]').first();
    this.contactNumberInput = page.locator('input[placeholder="Type here"]').nth(1);
    this.resumeUpload = page.locator('input[type="file"]');
    this.keywordsInput = page.locator('input[placeholder="Enter comma seperated words..."]');
    this.saveButton = page.locator('button[type="submit"]');
  }

  // Methods
  async addCandidate(
    firstName: string,
    lastName: string,
    email: string,
    contactNumber: string,
    resumePath?: string
  ): Promise<void> {
    await this.candidateNameInput.fill(`${firstName} ${lastName}`);
    await this.emailInput.fill(email);
    await this.contactNumberInput.fill(contactNumber);
    
    if (resumePath) {
      await this.resumeUpload.setInputFiles(resumePath);
    }
    
    await this.saveButton.click();
  }

  async searchCandidate(candidateName: string): Promise<void> {
    await this.candidateNameInput.fill(candidateName);
    await this.page.locator('button[type="submit"]').click();
  }

  async navigateToVacancies(): Promise<void> {
    await this.vacanciesTab.click();
  }
}