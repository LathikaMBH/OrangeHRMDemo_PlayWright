import * as dotenv from 'dotenv';
import * as path from 'path';

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnvironment: string;

  private constructor() {
    this.currentEnvironment = 'dev';
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  loadEnvironment(env: string = 'dev'): void {
    this.currentEnvironment = env;
    const envPath = path.join(__dirname, '../../config/environments', `${env}.env`);
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded environment: ${env}`);
  }

  getBaseUrl(): string {
    return process.env.BASE_URL || 'https://example.com';
  }

  getTimeout(): number {
    return parseInt(process.env.TIMEOUT || '30000');
  }

  getEnvironment(): string {
    return process.env.ENVIRONMENT || this.currentEnvironment;
  }

  isAIEnabled(): boolean {
    return process.env.AI_ENABLED === 'true';
  }

  getBrowser(): string {
    return process.env.BROWSER || 'chromium';
  }

  getWorkers(): number {
    return parseInt(process.env.WORKERS || '3');
  }

  isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }

  getRetries(): number {
    return parseInt(process.env.RETRIES || '1');
  }
}
