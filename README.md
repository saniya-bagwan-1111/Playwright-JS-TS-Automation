**Cmd to run Playwright built in test generator:**

The npx playwright codegen command runs Playwright's built-in test generator, which records your live browser interactions and automatically translates them into production-ready test scripts

**Basic Commands**

**Open Empty Recorder**: npx playwright codegen

**Target Specific Website**: npx playwright codegen

Ex-: D:\Playwrite>**npx playwright codegen** https://google.com

**Debug a specific test file:**

npx playwright test filename.spec.js --debug

**To open the Debug script**

use Ctrl+Shift+p

**To debug script we can add into the pacakge.json file under the script tag**

"scripts": {
    "test": "npx playwright test filename.spec.js --headed"  
  },

**MCP Server - Playwright Test agent**


npx playwright init-agents --loop=vscode

**What This Command Creates**

When executed at your project root, the CLI creates a set of markdown-based agent configuration files (typically under **.github/chatmodes/, .github/agents/**, or an agents/ directory depending on your exact minor framework version):

**playwright-test-planner.agent.md**: Instructions for the Planner Agent, which opens and explores your live app to generate a human-readable test plan (test-plan.md).

**playwright-test-generator.agent.md**: Instructions for the Generator Agent, which transforms the structured markdown test plan into functional, runnable .spec.ts test files.

**playwright-test-healer.agent.md**: Instructions for the Healer Agent, which auto-detects broken locators or layout changes upon test failure and automatically patches the code.

**tests/seed.spec.ts**: A base seed file used to provide global fixtures, auth cookies, or shared landing pages to the agents so they start with proper application context.
