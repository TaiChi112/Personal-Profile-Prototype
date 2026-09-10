# Application Observability

This document provides an overview of the observability tools configured in this application.

## Analytics

We use [Vercel Analytics](https://vercel.com/docs/analytics) for simple, privacy-friendly page view and custom event tracking.

It has been integrated into the application by wrapping our application content with the `<Analytics />` component in our root layout (`app/layout.tsx`). Once deployed to Vercel, it automatically starts tracking page views and core web vitals.

## Crash Reporting (Sentry)

While basic page view analytics is handled by Vercel Analytics, you can use [Sentry](https://sentry.io/) for advanced error tracking and performance monitoring.

### How to add Sentry in the future:

1. **Install Sentry SDKs**:
   ```bash
   bun add @sentry/nextjs
   ```

2. **Initialize Sentry configuration**:
   Run the Sentry Next.js wizard in your project root to auto-configure Sentry (it creates `sentry.client.config.ts`, `sentry.server.config.ts`, and updates your Next.js config):
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure Environment Variables**:
   Add the generated `SENTRY_DSN` and other necessary keys to your `.env` and Vercel project environment variables.

4. **Verify Sentry is capturing errors**:
   Trigger an intentional error in a test route to ensure issues are successfully sent to the Sentry dashboard.
