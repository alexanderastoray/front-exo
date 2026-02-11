/**
 * E2E Test Helper Functions
 * Common utilities for E2E tests
 */

import { Page, Browser, ElementHandle } from 'puppeteer';
import { E2E_CONFIG } from '../config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(
  page: Page,
  timeout: number = E2E_CONFIG.TIMEOUT.NAVIGATION
): Promise<void> {
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout });
}

/**
 * Wait for an element to be visible
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout: number = E2E_CONFIG.TIMEOUT.ELEMENT
): Promise<ElementHandle<Element> | null> {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return await page.$(selector);
  } catch (error) {
    console.error(`Element not found: ${selector}`);
    throw error;
  }
}

/**
 * Wait for multiple elements to be visible
 */
export async function waitForElements(
  page: Page,
  selector: string,
  timeout: number = E2E_CONFIG.TIMEOUT.ELEMENT
): Promise<ElementHandle<Element>[]> {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return await page.$$(selector);
  } catch (error) {
    console.error(`Elements not found: ${selector}`);
    throw error;
  }
}

/**
 * Click a button by text content
 */
export async function clickButton(
  page: Page,
  buttonText: string,
  timeout: number = E2E_CONFIG.TIMEOUT.ELEMENT
): Promise<void> {
  const button = await page.waitForFunction(
    (text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((btn) => btn.textContent?.includes(text));
    },
    { timeout },
    buttonText
  );

  if (button) {
    await (button as ElementHandle<Element>).click();
  } else {
    throw new Error(`Button with text "${buttonText}" not found`);
  }
}

/**
 * Click an element by selector
 */
export async function clickElement(
  page: Page,
  selector: string,
  timeout: number = E2E_CONFIG.TIMEOUT.ELEMENT
): Promise<void> {
  await waitForElement(page, selector, timeout);
  await page.click(selector);
}

/**
 * Fill a form input field
 */
export async function fillInput(
  page: Page,
  selector: string,
  value: string,
  clear: boolean = true
): Promise<void> {
  await waitForElement(page, selector);
  
  if (clear) {
    await page.click(selector, { clickCount: 3 }); // Select all
    await page.keyboard.press('Backspace');
  }
  
  await page.type(selector, value);
}

/**
 * Fill multiple form fields
 */
export async function fillForm(
  page: Page,
  fields: Record<string, string>
): Promise<void> {
  for (const [selector, value] of Object.entries(fields)) {
    await fillInput(page, selector, value);
  }
}

/**
 * Select an option from a dropdown
 */
export async function selectOption(
  page: Page,
  selector: string,
  value: string
): Promise<void> {
  await waitForElement(page, selector);
  await page.select(selector, value);
}

/**
 * Get text content of an element
 */
export async function getTextContent(
  page: Page,
  selector: string
): Promise<string> {
  await waitForElement(page, selector);
  const element = await page.$(selector);
  
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  
  const text = await page.evaluate((el) => el.textContent || '', element);
  return text.trim();
}

/**
 * Get text content of multiple elements
 */
export async function getTextContents(
  page: Page,
  selector: string
): Promise<string[]> {
  const elements = await waitForElements(page, selector);
  
  const texts = await Promise.all(
    elements.map((el) => page.evaluate((element) => element.textContent || '', el))
  );
  
  return texts.map((text) => text.trim());
}

/**
 * Check if element exists
 */
export async function elementExists(
  page: Page,
  selector: string
): Promise<boolean> {
  try {
    const element = await page.$(selector);
    return element !== null;
  } catch {
    return false;
  }
}

/**
 * Check if element is visible
 */
export async function isElementVisible(
  page: Page,
  selector: string
): Promise<boolean> {
  try {
    const element = await page.$(selector);
    if (!element) return false;
    
    const isVisible = await page.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }, element);
    
    return isVisible;
  } catch {
    return false;
  }
}

/**
 * Wait for text to appear on page
 */
export async function waitForText(
  page: Page,
  text: string,
  timeout: number = E2E_CONFIG.TIMEOUT.ELEMENT
): Promise<void> {
  await page.waitForFunction(
    (searchText) => document.body.textContent?.includes(searchText),
    { timeout },
    text
  );
}

/**
 * Take a screenshot for debugging
 */
export async function takeScreenshot(
  page: Page,
  name: string
): Promise<void> {
  if (!E2E_CONFIG.SCREENSHOT.enabled && process.env.CI !== 'true') {
    return; // Skip screenshots unless explicitly enabled or in CI
  }

  const screenshotDir = E2E_CONFIG.SCREENSHOT.path;
  
  // Create screenshot directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(screenshotDir, filename);

  await page.screenshot({
    path: filepath,
    fullPage: E2E_CONFIG.SCREENSHOT.fullPage,
  });

  console.log(`📸 Screenshot saved: ${filepath}`);
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = E2E_CONFIG.TIMEOUT.API
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`API response timeout: ${urlPattern}`));
    }, timeout);

    page.on('response', async (response) => {
      const url = response.url();
      const matches =
        typeof urlPattern === 'string'
          ? url.includes(urlPattern)
          : urlPattern.test(url);

      if (matches) {
        clearTimeout(timeoutId);
        try {
          const data = await response.json();
          resolve(data);
        } catch (error) {
          resolve(null);
        }
      }
    });
  });
}

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateToPage(
  page: Page,
  path: string = ''
): Promise<void> {
  const url = `${E2E_CONFIG.FRONTEND_URL}${path}`;
  await page.goto(url, { waitUntil: 'networkidle0' });
}

/**
 * Reload the current page
 */
export async function reloadPage(page: Page): Promise<void> {
  await page.reload({ waitUntil: 'networkidle0' });
}

/**
 * Clear browser storage
 */
export async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get element attribute value
 */
export async function getAttributeValue(
  page: Page,
  selector: string,
  attribute: string
): Promise<string | null> {
  await waitForElement(page, selector);
  const element = await page.$(selector);
  
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  
  return await page.evaluate(
    (el, attr) => el.getAttribute(attr),
    element,
    attribute
  );
}

/**
 * Wait for element to be removed from DOM
 */
export async function waitForElementToBeRemoved(
  page: Page,
  selector: string,
  timeout: number = E2E_CONFIG.TIMEOUT.ELEMENT
): Promise<void> {
  await page.waitForFunction(
    (sel) => !document.querySelector(sel),
    { timeout },
    selector
  );
}

/**
 * Scroll to element
 */
export async function scrollToElement(
  page: Page,
  selector: string
): Promise<void> {
  const element = await waitForElement(page, selector);
  if (element) {
    await page.evaluate((el) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, element);
    // Wait a bit for smooth scroll to complete
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

/**
 * Get count of elements matching selector
 */
export async function getElementCount(
  page: Page,
  selector: string
): Promise<number> {
  const elements = await page.$$(selector);
  return elements.length;
}

/**
 * Press keyboard key
 */
export async function pressKey(
  page: Page,
  key: string
): Promise<void> {
  await page.keyboard.press(key as any);
}

/**
 * Type text with delay (simulates human typing)
 */
export async function typeWithDelay(
  page: Page,
  selector: string,
  text: string,
  delay: number = 50
): Promise<void> {
  await waitForElement(page, selector);
  await page.type(selector, text, { delay });
}
