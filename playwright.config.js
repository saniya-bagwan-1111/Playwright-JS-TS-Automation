// @ts-check
import { defineConfig, devices, expect } from '@playwright/test';
import { TIMEOUT } from 'node:dns';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
//export default defineConfig({//1 way
const Config=({//1 way
  testDir: './tests',
  /* Run tests in files in parallel */
  reporter:'html',
  timeout: 30*1000,//setting default time , 3 sec
  expect:{
    TIMEOUT:5000//explicit time out
  },

  use: {

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    browserName:'firefox',
    headless: false//npx playwright test --headed
  },

  });

  module.exports=Config;

