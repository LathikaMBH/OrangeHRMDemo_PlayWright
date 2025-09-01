// AI Agent Type Definitions

export interface AnalysisResult {
  message: string;
  suggestions: string[];
  rootCauses?: string[];
  affectedTests?: string[];
  confidence?: number;
}

export interface TestResult {
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedout';
  error?: string;
  screenshot?: string;
  duration?: number;
  file?: string;
}

export interface Suggestion {
  type: 'performance' | 'reliability' | 'maintainability' | 'coverage';
  description: string;
  file: string;
  line?: number;
  code?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface FlakyTest {
  name: string;
  file: string;
  failurePattern: string;
  code?: string;
  failureRate?: number;
}

export interface FixResult {
  testFile: string;
  issue: string;
  suggestedFix: string;
  confidence: number;
}

export interface PageObjectModel {
  fileName: string;
  className: string;
  url: string;
  code: string;
  methods: string[];
}

export interface ReportEnhancement {
  reporterCode: string;
  htmlTemplate: string;
  notificationCode: string;
  dashboardCode: string;
  features: string[];
}

export interface HelperClassSuggestion {
  className: string;
  description: string;
  code: string;
  testCode: string;
  category: 'database' | 'api' | 'ui' | 'utils' | 'auth' | 'performance';
}

export interface ArchitectureOptimization {
  improvements: string[];
  filesCreated: string[];
  performanceGain: number;
  configChanges: string[];
}

export interface DataManagementSystem {
  factories: string[];
  providers: string[];
  cleanupScripts: string[];
  configuration: string;
}

export interface TestPattern {
  pattern: string;
  frequency: number;
  files: string[];
  examples: string[];
}

export interface DataPattern {
  type: 'database' | 'api' | 'file' | 'mock';
  usage: string;
  frequency: number;
  examples: string[];
}

export interface FrameworkStructure {
  directories: string[];
  files: string[];
  configurations: string[];
  dependencies: string[];
}

// Configuration interfaces
export interface AgentConfig {
  anthropicApiKey?: string;
  githubToken?: string;
  githubRepoOwner?: string;
  githubRepoName?: string;
  baseUrl?: string;
  testResultsPath?: string;
  maxTokens?: number;
  model?: string;
}

// Utility types for better type safety
export type AnalysisType = 'failures' | 'performance' | 'coverage' | 'flaky' | 'improvements';
export type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedout';
export type SuggestionType = 'performance' | 'reliability' | 'maintainability' | 'coverage';
export type Priority = 'low' | 'medium' | 'high';

// Error types
export class AIAgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AIAgentError';
  }
}

export class APIError extends AIAgentError {
  constructor(message: string, details?: any) {
    super(message, 'API_ERROR', details);
  }
}

export class ConfigurationError extends AIAgentError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIG_ERROR', details);
  }
}