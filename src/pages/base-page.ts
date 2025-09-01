import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs/promises';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation methods
  async navigateTo(url: string): Promise<void> {
    console.log(`🌐 Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Element interaction methods
  async click(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click(options);
    console.log(`🖱️ Clicked: ${await this.getElementDescription(locator)}`);
  }

  async fill(locator: Locator, text: string, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text, options);
    console.log(`⌨️ Filled text: ${text}`);
  }

  async selectOption(locator: Locator, option: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(option);
    console.log(`📝 Selected option: ${option}`);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async getValue(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.inputValue();
  }

  // Wait methods
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ timeout, state: 'visible' });
  }

  async waitForElementToHide(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ timeout, state: 'hidden' });
  }

  async waitForUrl(url: string | RegExp, timeout: number = 10000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  // Assertion methods
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async verifyElementHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  async verifyElementText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async verifyElementContainsText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async verifyElementEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async verifyElementDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  // Screenshot and debugging methods
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }

  async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}-element-${timestamp}.png`;
    await locator.screenshot({ path: screenshotPath });
    console.log(`📸 Element screenshot saved: ${screenshotPath}`);
  }

  // JavaScript execution
  async executeScript(script: string): Promise<any> {
    return await this.page.evaluate(script);
  }

  // Cookie methods
  async setCookie(name: string, value: string): Promise<void> {
    await this.page.context().addCookies([
      { name, value, url: this.page.url() }
    ]);
  }

  async getCookie(name: string): Promise<string | null> {
    const cookies = await this.page.context().cookies();
    const cookie = cookies.find(c => c.name === name);
    return cookie ? cookie.value : null;
  }

  // Utility methods
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async hover(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async doubleClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.dblclick();
  }

  async rightClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click({ button: 'right' });
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    try {
      const isEnabled = await locator.isEnabled();
      return isEnabled;
    } catch {
      return false;
    }
  }

  // Helper method to get element description for logging
  private async getElementDescription(locator: Locator): Promise<string> {
    try {
      const element = locator.first();
      const tagName = await element.evaluate(el => el.tagName);
      const text = await element.textContent();
      const placeholder = await element.getAttribute('placeholder');
      
      if (text) return `${tagName} with text "${text.substring(0, 30)}..."`;
      if (placeholder) return `${tagName} with placeholder "${placeholder}"`;
      return tagName;
    } catch {
      return 'Element';
    }
  }
}