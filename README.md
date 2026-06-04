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
