import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import type { TestResult } from '../types';

export class PlaywrightIntegration {
  private testResultsPath: string;
  private testDirectory: string;

  constructor() {
    this.testResultsPath = process.env.TEST_RESULTS_PATH || 'test-results';
    this.testDirectory = 'tests';
  }

  // Test results operations
  async getLatestTestResults(): Promise<TestResult[]> {
    try {
      const resultsPath = path.join(this.testResultsPath, 'results.json');
      
      if (await this.fileExists(resultsPath)) {
        const content = await fs.readFile(resultsPath, 'utf-8');
        const results = JSON.parse(content);
        
        return this.parsePlaywrightResults(results);
      }

      // If no results file, return mock data for development
      console.warn('No test results found, returning mock data');
      return this.getMockTestResults();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to get test results: ${errorMessage}`);
      return this.getMockTestResults();
    }
  }

  private parsePlaywrightResults(results: any): TestResult[] {
    try {
      const testResults: TestResult[] = [];

      if (results.suites && Array.isArray(results.suites)) {
        for (const suite of results.suites) {
          if (suite.tests && Array.isArray(suite.tests)) {
            for (const test of suite.tests) {
              testResults.push({
                title: test.title || 'Unknown test',
                status: this.mapPlaywrightStatus(test.status),
                error: test.error?.message,
                screenshot: test.screenshot,
                duration: test.duration || 0,
                file: suite.file || 'unknown'
              });
            }
          }
        }
      }

      return testResults;
    } catch (error) {
      console.error('Error parsing Playwright results:', error);
      return [];
    }
  }

  private mapPlaywrightStatus(status: string): 'passed' | 'failed' | 'skipped' | 'timedout' {
    switch (status?.toLowerCase()) {
      case 'passed': return 'passed';
      case 'failed': return 'failed';
      case 'skipped': return 'skipped';
      case 'timedout': return 'timedout';
      default: return 'failed';
    }
  }

  private getMockTestResults(): TestResult[] {
    return [
      {
        title: 'should login with valid credentials',
        status: 'passed',
        duration: 2500,
        file: 'tests/specs/login.spec.ts'
      },
      {
        title: 'should show error with invalid credentials',
        status: 'failed',
        error: 'Timeout: element not visible within 10000ms',
        duration: 10000,
        file: 'tests/specs/login.spec.ts'
      },
      {
        title: 'should validate empty fields',
        status: 'passed',
        duration: 1800,
        file: 'tests/specs/login.spec.ts'
      }
    ];
  }

  // Test file operations
  async getExistingTests(): Promise<string[]> {
    try {
      const testFiles = await this.getAllTestFiles();
      const testContents: string[] = [];

      for (const file of testFiles.slice(0, 3)) { // Limit to first 3 for performance
        try {
          const content = await fs.readFile(file, 'utf-8');
          testContents.push(content);
        } catch (error) {
          console.warn(`Could not read test file: ${file}`);
        }
      }

      return testContents;
    } catch (error) {
      console.error('Failed to get existing tests:', error);
      return [];
    }
  }

  async getAllTestFiles(): Promise<string[]> {
    try {
      const pattern = path.join(this.testDirectory, '**/*.{spec,test}.ts');
      const files = await glob(pattern);
      return files;
    } catch (error) {
      console.error('Failed to get test files:', error);
      return [];
    }
  }

  async getExistingHelpers(): Promise<string[]> {
    try {
      const helpersDir = 'src/helpers';
      
      if (await this.directoryExists(helpersDir)) {
        const files = await fs.readdir(helpersDir);
        return files
          .filter(file => file.endsWith('.ts'))
          .map(file => path.join(helpersDir, file));
      }

      return [];
    } catch (error) {
      console.error('Failed to get helper files:', error);
      return [];
    }
  }

  async analyzeTestPatterns(): Promise<any[]> {
    try {
      const testFiles = await this.getAllTestFiles();
      const patterns = [];

      for (const file of testFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          patterns.push({
            file,
            testCount: (content.match(/test\s*\(/g) || []).length,
            describeCount: (content.match(/describe\s*\(/g) || []).length,
            expectCount: (content.match(/expect\s*\(/g) || []).length,
            hasPageObject: content.includes('page.') || content.includes('Page'),
            hasLocators: content.includes('locator('),
            hasWaits: content.includes('waitFor'),
            hasScreenshots: content.includes('screenshot'),
            size: content.length
          });
        } catch (error) {
          console.warn(`Could not analyze patterns in ${file}`);
        }
      }

      return patterns;
    } catch (error) {
      console.error('Failed to analyze test patterns:', error);
      return [];
    }
  }

  // Configuration analysis
  async analyzeCurrentReporting(): Promise<any> {
    try {
      const configPath = 'playwright.config.ts';
      
      if (await this.fileExists(configPath)) {
        const content = await fs.readFile(configPath, 'utf-8');
        
        return {
          hasHtmlReporter: content.includes('html'),
          hasJsonReporter: content.includes('json'),
          hasJunitReporter: content.includes('junit'),
          hasAllureReporter: content.includes('allure'),
          hasScreenshots: content.includes('screenshot'),
          hasVideo: content.includes('video'),
          hasTrace: content.includes('trace'),
          configContent: content
        };
      }

      return {
        hasBasicConfig: false,
        message: 'No Playwright configuration found'
      };
    } catch (error) {
      console.error('Failed to analyze reporting configuration:', error);
      return { error: 'Analysis failed' };
    }
  }

  // Data usage analysis
  async analyzeDataUsage(): Promise<any[]> {
    try {
      const testFiles = await this.getAllTestFiles();
      const dataPatterns = [];

      for (const file of testFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          dataPatterns.push({
            file,
            usesTestData: content.includes('testData') || content.includes('fixtures'),
            usesFaker: content.includes('faker'),
            usesJsonFiles: content.includes('.json'),
            usesEnvironmentVars: content.includes('process.env'),
            usesDatabase: content.includes('db.') || content.includes('database'),
            usesAPI: content.includes('api.') || content.includes('fetch'),
            hardcodedData: this.countHardcodedStrings(content)
          });
        } catch (error) {
          console.warn(`Could not analyze data usage in ${file}`);
        }
      }

      return dataPatterns;
    } catch (error) {
      console.error('Failed to analyze data usage:', error);
      return [];
    }
  }

  private countHardcodedStrings(content: string): number {
    // Simple heuristic to count potential hardcoded test data
    const stringMatches = content.match(/"[^"]{3,}"/g) || [];
    const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const urlMatches = content.match(/https?:\/\/[^\s"']+/g) || [];
    
    return stringMatches.length + emailMatches.length + urlMatches.length;
  }

  // Utility methods
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  // Test execution helpers
  async getFailedTests(): Promise<TestResult[]> {
    const allResults = await this.getLatestTestResults();
    return allResults.filter(result => result.status === 'failed');
  }

  async getPassedTests(): Promise<TestResult[]> {
    const allResults = await this.getLatestTestResults();
    return allResults.filter(result => result.status === 'passed');
  }

  async getTestSummary(): Promise<{
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
  }> {
    const allResults = await this.getLatestTestResults();
    const passed = allResults.filter(r => r.status === 'passed').length;
    const failed = allResults.filter(r => r.status === 'failed').length;
    const skipped = allResults.filter(r => r.status === 'skipped').length;
    const total = allResults.length;
    
    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const testDir = await this.directoryExists(this.testDirectory);
      const configExists = await this.fileExists('playwright.config.ts');
      
      console.log(`✅ Playwright integration check:`);
      console.log(`   - Test directory exists: ${testDir}`);
      console.log(`   - Config file exists: ${configExists}`);
      
      return testDir || configExists;
    } catch (error) {
      console.error('❌ Playwright integration test failed:', error);
      return false;
    }
  }
}