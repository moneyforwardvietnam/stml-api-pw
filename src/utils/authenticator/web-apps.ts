import {chromium} from '@playwright/test';
import {Logger} from '../logger';

export async function getCode(clientId: string, username: string, password: string): Promise<string | null> {
    const browser = await chromium.launch({
        headless: true,
    });
    const page = await browser.newPage();
    const URL: string = `https://api.biz.test.mfw.work/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Finvoice-stg1.ebisubook.com%2Fapi%2Foauth2_redirect&response_type=code&scope=mfc%2Finvoice%2Fdata.write`;
    await page.goto(URL);

    await page.locator("[name='mfid_user[email]']").fill(username);
    await page.locator("#submitto").click();
    await page.locator("[name='mfid_user[password]']").fill(password);
    await page.locator("#submitto").click();
    await page.locator("form button.btn-primary").click();
    await page.locator("form input.btn-primary").click();
    await waitForURLContains(page, '/oauth2_redirect?', 60000);
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
