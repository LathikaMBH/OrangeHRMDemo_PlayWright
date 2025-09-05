import * as fs from 'fs';
import * as path from 'path';

export interface TestUser {
  username: string;
  password: string;
  email?: string;
  role?: string;
}

export interface TestData {
  users: Record<string, TestUser>;
  urls: Record<string, string>;
  testData: Record<string, any>;
}

export class TestDataManager {
  private static dataCache: Map<string, any> = new Map();

  static loadTestData(filename: string = 'test-data.json'): TestData {
    const cacheKey = filename;
    
    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey);
    }

    const dataPath = path.join(__dirname, '../data', filename);
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Test data file not found: ${dataPath}`);
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const testData = JSON.parse(rawData);
    
    this.dataCache.set(cacheKey, testData);
    return testData;
  }

  static getUser(userType: string, filename: string = 'test-data.json'): TestUser {
    const data = this.loadTestData(filename);
    
    if (!data.users || !data.users[userType]) {
      throw new Error(`User type '${userType}' not found in test data`);
    }
    
    return data.users[userType];
  }

  static getUrl(urlKey: string, filename: string = 'test-data.json'): string {
    const data = this.loadTestData(filename);
    
    if (!data.urls || !data.urls[urlKey]) {
      throw new Error(`URL '${urlKey}' not found in test data`);
    }
    
    return data.urls[urlKey];
  }
}
