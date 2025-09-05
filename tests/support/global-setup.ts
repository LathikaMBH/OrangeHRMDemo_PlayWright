import { FullConfig } from '@playwright/test';
import { EnvironmentManager } from '../../src/helpers/environment-manager';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Global Setup - AI-Enhanced Playwright Framework');
  
  const envManager = EnvironmentManager.getInstance();
  const environment = process.env.TEST_ENV || 'dev';
  envManager.loadEnvironment(environment);
  
  console.log(`📊 Test Configuration:`);
  console.log(`   Environment: ${envManager.getEnvironment()}`);
  console.log(`   Base URL: ${envManager.getBaseUrl()}`);
  console.log(`   Browser: ${envManager.getBrowser()}`);
  console.log(`   Headless: ${envManager.isHeadless()}`);
  console.log(`   Workers: ${envManager.getWorkers()}`);
  console.log(`   AI Enabled: ${envManager.isAIEnabled()}`);
  
  if (envManager.isAIEnabled()) {
    console.log('🤖 Using your original AI agent system:');
    console.log('   Core Agent: ai-agent/src/agent.ts');
    console.log('   Analyzers: ai-agent/src/analyzers/');
    console.log('   Generators: ai-agent/src/generators/');
    console.log('   Integrations: ai-agent/src/integrations/');
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;
