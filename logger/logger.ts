import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

// create pino-logflare console stream for serverless functions and send function for browser logs
// Browser logs are going to: https://logflare.app/sources/13989
// Vercel log drain was setup to send logs here: https://logflare.app/sources/13830

// Sources:
// https://github.com/Logflare/next-pino-logflare-logging-example
// https://github.com/Logflare/pino-logflare
// https://github.com/pinojs/pino-nextjs-example

const { stream, send } = logflarePinoVercel({
  apiKey: process.env.NEXT_PUBLIC_LOGFLARE_API_KEY as string,
  sourceToken: process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN as string,
});

// create pino logger
const logger = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send,
      },
    },
    level: "debug",
    base: {
      env: process.env.VERCEL_ENV || "local",
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream
);

export default logger;
