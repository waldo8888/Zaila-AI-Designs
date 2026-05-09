// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a1520270558b0617dc2d68e13f30bad6@o4511083352489984.ingest.us.sentry.io/4511083361992704",

  // Keep browser tracing lightweight. Session Replay is intentionally not enabled here
  // because it adds a large client bundle and long startup tasks on a visual-heavy site.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  enableLogs: false,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
