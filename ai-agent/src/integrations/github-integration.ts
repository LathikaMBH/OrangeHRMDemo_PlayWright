import { Octokit } from '@octokit/rest';
import * as fs from 'fs/promises';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class GitHubIntegration {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    this.octokit = new Octokit({
      auth: token,
    });

    this.owner = process.env.GITHUB_REPO_OWNER || '';
    this.repo = process.env.GITHUB_REPO_NAME || '';

    if (!this.owner || !this.repo) {
      console.warn('GITHUB_REPO_OWNER and GITHUB_REPO_NAME should be set in environment variables');
    }
  }

  // Repository operations
  async getRepository() {
    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      return repo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get repository: ${errorMessage}`);
    }
  }

  // File operations
  async getFileContent(filePath: string): Promise<string> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
      });

      if ('content' in data && typeof data.content === 'string') {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      
      throw new Error('File content not found or is not a file');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get file content for ${filePath}: ${errorMessage}`);
    }
  }

  async listFiles(directoryPath: string = ''): Promise<string[]> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: directoryPath,
      });

      if (Array.isArray(data)) {
        return data
          .filter(item => item.type === 'file')
          .map(item => item.path);
      }
      
      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to list files in ${directoryPath}: ${errorMessage}`);
      return [];
    }
  }

  async getTestFiles(): Promise<string[]> {
    try {
      const allFiles = await this.listFiles('tests');
      return allFiles.filter(file => 
        file.endsWith('.spec.ts') || 
        file.endsWith('.test.ts')
      );
    } catch (error) {
      console.error('Failed to get test files:', error);
      return [];
    }
  }

  async getPageObjectFiles(): Promise<string[]> {
    try {
      const allFiles = await this.listFiles('src/pages');
      return allFiles.filter(file => file.endsWith('.ts'));
    } catch (error) {
      console.error('Failed to get page object files:', error);
      return [];
    }
  }

  // Commit operations
  async getRecentCommits(count: number = 10) {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner: this.owner,
        repo: this.repo,
        per_page: count,
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get recent commits: ${errorMessage}`);
    }
  }

  async getCommitDetails(sha: string) {
    try {
      const { data } = await this.octokit.rest.repos.getCommit({
        owner: this.owner,
        repo: this.repo,
        ref: sha,
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get commit details for ${sha}: ${errorMessage}`);
    }
  }

  // Pull request operations
  async createPullRequest(title: string, body: string, headBranch: string, baseBranch: string = 'main') {
    try {
      const { data } = await this.octokit.rest.pulls.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        head: headBranch,
        base: baseBranch,
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create pull request: ${errorMessage}`);
    }
  }

  // Issues operations
  async createIssue(title: string, body: string, labels: string[] = []) {
    try {
      const { data } = await this.octokit.rest.issues.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        labels,
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create issue: ${errorMessage}`);
    }
  }

  // Branch operations
  async createBranch(branchName: string, fromBranch: string = 'main') {
    try {
      // Get the SHA of the source branch
      const { data: refData } = await this.octokit.rest.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${fromBranch}`,
      });

      // Create new branch
      const { data } = await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: refData.object.sha,
      });
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create branch ${branchName}: ${errorMessage}`);
    }
  }

  // Utility methods
  async analyzeRepositoryStructure() {
    try {
      const repository = await this.getRepository();
      const testFiles = await this.getTestFiles();
      const pageObjectFiles = await this.getPageObjectFiles();
      const recentCommits = await this.getRecentCommits(5);

      return {
        repository: {
          name: repository.name,
          description: repository.description,
          language: repository.language,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
        },
        testFiles: testFiles.length,
        pageObjectFiles: pageObjectFiles.length,
        recentActivity: recentCommits.length,
        structure: {
          hasTests: testFiles.length > 0,
          hasPageObjects: pageObjectFiles.length > 0,
          hasPlaywrightConfig: await this.fileExists('playwright.config.ts'),
          hasPackageJson: await this.fileExists('package.json'),
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to analyze repository structure: ${errorMessage}`);
      return null;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.getFileContent(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Test for connection
  async testConnection(): Promise<boolean> {
    try {
      await this.octokit.rest.users.getAuthenticated();
      console.log('✅ GitHub connection successful');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`❌ GitHub connection failed: ${errorMessage}`);
      return false;
    }
  }
}