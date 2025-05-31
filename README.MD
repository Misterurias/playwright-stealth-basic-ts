# Playwright with puppeteer-stealth

A basic Playwright setup with stealth plugin for bot detection testing and web automation. **Note: This template prioritizes compatibility and ease of use over perfect stealth.**
There are stronger stealth contenders that I will update / add as a template soon.

## What it does

- Uses `playwright-extra` with `puppeteer-extra-plugin-stealth` for basic bot detection bypass
- Launches a headless Chrome browser and tests against SannySoft bot detection
- Provides detailed test results showing which detection methods pass/fail
- Built with TypeScript for better development experience

## ⚠️ Important Limitations

**This template CAN be fingerprinted and detected by advanced anti-bot systems:**

- ✅ **Works well for**: Basic testing, screenshots, simple automation, development
- ❌ **Will be detected by**: Advanced fingerprinting sites, Cloudflare, modern anti-bot systems
- 🎯 **Use case**: Development, testing, proof-of-concepts, educational purposes

**Docker Version Lock**: Uses Playwright v1.50.0 to match Microsoft's official Docker image (`mcr.microsoft.com/playwright:v1.50.0-noble`). Microsoft's images are often behind the latest Playwright releases, so this template is locked to maintain compatibility.
Let me know if you find them too slow. I've build a few ones myself before.