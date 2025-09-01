
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

export interface ArchitectureOptimization {
  improvements: string[];
  filesCreated: string[];
  performanceGain: number;
  configChanges: string[];
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
//"@ | Out-File -FilePath "ai-agent\src\types\index.ts" -Encoding utf8