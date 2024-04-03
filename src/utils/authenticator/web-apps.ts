import { chromium } from '@playwright/test';
import { Logger } from '../logger';

export async function getCode(clientId: string, username: string, password: string): Promise<string | null> {
    const browser = await chromium.launch({
        headless: false,
    });
    const page = await browser.newPage();
    const redirect_uri = process.env.REDIRECT_URI;
    const URL: string = `https://api.biz.test.mfw.work/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=mfc/contract/contract.read mfc/contract/contract.write`;
    await page.goto(URL);

    await page.locator("[name='mfid_user[email]']").fill(username);
    await page.locator("#submitto").click();
    await page.locator("[name='mfid_user[password]']").fill(password);
    await page.locator("#submitto").click();
    let bio = page.locator("img[alt='sign-in with passkeys'] ~ a");
    if (await bio.isVisible({ timeout: 2 })) {
        await bio.click();
    }

    await page.locator("//tr/td[text()='5981-1807']").click();
    // Modify the dynamic locator

    await page.locator("button.btn-primary").click();
    await page.locator("form input.btn-primary").click();
    await waitForURLContains(page, 'callback?code=', 60000);
    let url = page.url();
    await browser.close();
    return await extractCode(url);
}

async function extractCode(url: string): Promise<string | null> {
    try {
        const uri = new URL(url);
        const query = uri.searchParams;
        const queryParams = Array.from(query.entries());
        for (const [key, value] of queryParams) {
            if (key === "code") {
                Logger.info("App code is extracted successfully");
                return value;
            }
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}


async function waitForURLContains(page: any, substring: string, timeout = 5000) {
    const timeoutDate = Date.now() + timeout;

    const checkURL = () => {
        const currentURL = page.url();
        return currentURL.includes(substring);
    };

    while (Date.now() < timeoutDate) {
        if (checkURL()) {
            return;
        }
        await page.waitForTimeout(100);
    }

    throw new Error(`Timeout waiting for URL to contain "${substring}"`);
}
