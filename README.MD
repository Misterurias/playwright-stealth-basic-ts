# Playwright with puppeteer-stealth

A basic Playwright setup with stealth plugin for bot detection testing and web automation. **Note: This template prioritizes compatibility and ease of use over perfect stealth.**
There are stronger stealth contenders that I will update / add as a template soon.

## What it does

- Uses `playwright-extra` with `puppeteer-extra-plugin-stealth` for basic bot detection bypass
- Launches a visible Chrome browser and tests against SannySoft bot detection
- Provides detailed test results showing which detection methods pass/fail

## ⚠️ Important Limitations

**This template CAN be fingerprinted and detected by advanced anti-bot systems:**

- ✅ **Works well for**: Basic testing, screenshots, simple automation, development
- ❌ **Will be detected by**: Advanced fingerprinting sites, Cloudflare, modern anti-bot systems
- 🎯 **Use case**: Development, testing, proof-of-concepts, educational purposes