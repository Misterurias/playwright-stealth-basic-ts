import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin - this uses the actual puppeteer stealth plugin!
chromium.use(StealthPlugin());

async function testBotDetection() {
    console.log('🚀 Starting Playwright Stealth Test...\n');

    // Launch browser with stealth
    const browser = await chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 }
    });

    const page = await context.newPage();

    try {
        // Test with bot detection site
        console.log('📍 Testing: https://bot.sannysoft.com/');
        await page.goto('https://bot.sannysoft.com/', { waitUntil: 'load' });

        // Get page title
        const title = await page.title();
        console.log(`📄 Page title: ${title}`);

        // Log key page elements that indicate detection status
        console.log('\n🧪 Detection Test Results:');
        try {
            const results = await page.$$eval('table tr', rows => {
                return rows
                    .map(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length !== 2 && cells.length !== 3) return null;

                        const name = cells[0]?.innerText?.trim();
                        const result = cells[1]?.innerText?.trim();
                        const className = cells[1]?.className;

                        return {
                            name,
                            result,
                            status: className?.includes('passed') ? 'passed'
                                : className?.includes('warn') ? 'warn'
                                    : className?.includes('failed') ? 'failed'
                                        : 'unknown'
                        };
                    })
                    .filter(Boolean);
            });

            // Analyze and report
            const failed = results.filter(r => r?.status === 'failed');
            const warned = results.filter(r => r?.status === 'warn');
            const passed = results.filter(r => r?.status === 'passed');

            console.log(`\n✅ Passed: ${passed.length}`);
            console.log(`⚠️  Warnings: ${warned.length}`);
            console.log(`❌ Failed: ${failed.length}`);

            if (failed.length > 0 || warned.length > 0) {
                console.log('\n🧪 Problematic tests:\n');
                [...failed, ...warned].forEach(r => {
                    console.log(`  [${r?.status.toUpperCase()}] ${r?.name} → ${r?.result}`);
                });
            } else {
                console.log('\n🎉 All tests passed with no issues!');
            }
        } catch (error) {
            console.log('ℹ️  Could not extract detailed test results');
        }

        console.log('\n✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the test
testBotDetection().catch(console.error);