export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly companyBranding: Locator;
  readonly loginPanel: Locator;
  readonly demoCredentials: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.companyBranding = page.locator('.orangehrm-login-branding');
    this.loginPanel = page.locator('.orangehrm-login-container');
    this.demoCredentials = page.locator('.orangehrm-demo-credentials');
  }

  // Methods
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.login('Admin', 'admin123');
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getUsernamePlaceholder(): Promise<string> {
    return await this.usernameInput.getAttribute('placeholder') || '';
  }

  async getPasswordPlaceholder(): Promise<string> {
    return await this.passwordInput.getAttribute('placeholder') || '';
  }

  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async isLoginPanelVisible(): Promise<boolean> {
    return await this.loginPanel.isVisible();
  }

  async getDemoCredentialsText(): Promise<string> {
    return await this.demoCredentials.textContent() || '';
  }
}