// main.ts
// import express from "express";
// import { chromium } from "playwright-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";

// chromium.use(StealthPlugin());

// const app = express();
// app.use(express.json());

// app.post("/scrape", async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: "Missing URL" });

//   console.log(`📥 Received scrape request for: ${url}`);

//   const browser = await chromium.launch({
//     headless: true,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-blink-features=AutomationControlled"
//     ]
//   });

//   try {
//     const context = await browser.newContext({
//       userAgent:
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//       viewport: { width: 1366, height: 768 }
//     });

//     const page = await context.newPage();
//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
//     await page.waitForTimeout(3000); // optional buffer for JS rendering
//     const html = await page.content();

//     await browser.close();

//     return res.json({ html });
//   } catch (err) {
//     await browser.close();
//     console.error("❌ Scrape failed:", err);
//     return res.status(500).json({ error: "Failed to scrape URL." });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Stealth scraper running on port ${PORT}`));

// main.ts
import dotenv from "dotenv";
import express from "express";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

dotenv.config();
chromium.use(StealthPlugin());

const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  console.log(`📥 Received scrape request for: ${url}`);

  // Load proxy credentials from environment variables
  const PROXY_USER = process.env.PROXY_USER;
  const PROXY_PASS = process.env.PROXY_PASS;

  if (!PROXY_USER || !PROXY_PASS) {
    console.error("❌ Proxy credentials missing from environment variables.");
    return res.status(500).json({ error: "Proxy credentials not configured." });
  }

  // --- Launch Chromium with Residential Proxy ---
  const browser = await chromium.launch({
    headless: true,
    proxy: {
      server: "http://geo.iproyal.com:12321",
      username: PROXY_USER,
      password: PROXY_PASS,
    },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1366, height: 768 },
    });

    const page = await context.newPage();

    console.log("🌐 Navigating with residential proxy…");

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Give CF time to issue challenge cookie if needed
    await page.waitForTimeout(3500);

    const html = await page.content();

    console.log("✅ Successfully scraped page.");

    await browser.close();

    return res.json({ html });
  } catch (err) {
    console.error("❌ Scrape failed:", err);
    await browser.close();
    return res.status(500).json({ error: "Failed to scrape URL." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Stealth scraper running on port ${PORT}`));
