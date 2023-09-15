import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().min(1),
  APP_NAME: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  SLACK_BOT_TOKEN: z.string().min(1),
  WISTIA_ACCESS_TOKEN: z.string().min(1),
  WISTIA_FOUNDER_VIDEO_PROJECT_ID: z.string().min(1),
  WISTIA_STATS_API_URL: z.string().url(),
  WISTIA_STATS_TOKEN: z.string().min(1),
  CUSTOMERIO_TRACKING_SITE_ID: z.string().min(1),
  CUSTOMERIO_API_KEY: z.string().min(1),
  CUSTOMERIO_TRACKING_API_KEY: z.string().min(1),
  BASE_URL: z.string().url(),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  DEPLOY_ENV: z.enum(["development", "test", "staging", "production"]),
  RENDER_INTERNAL_HOSTNAME: z.string().min(1).optional(),
  V1_NEXTAUTH_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  ASSEMBLY_AI_API_KEY: z.string().min(1),
});



/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE: z.string().url(),
  NEXT_PUBLIC_APP_BASE_URL: z.string().url(),
  NEXT_PUBLIC_V1_BASE_URL: z.string().url(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * edge runtimes (e.g. middlewares) or client-side so we need to destruct manually.
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  WISTIA_ACCESS_TOKEN: process.env.WISTIA_ACCESS_TOKEN,
  WISTIA_FOUNDER_VIDEO_PROJECT_ID: process.env.WISTIA_FOUNDER_VIDEO_PROJECT_ID,
  WISTIA_STATS_API_URL: process.env.WISTIA_STATS_API_URL,
  WISTIA_STATS_TOKEN: process.env.WISTIA_STATS_TOKEN,
  CUSTOMERIO_TRACKING_SITE_ID: process.env.CUSTOMERIO_TRACKING_SITE_ID,
  CUSTOMERIO_API_KEY: process.env.CUSTOMERIO_API_KEY,
  CUSTOMERIO_TRACKING_API_KEY: process.env.CUSTOMERIO_TRACKING_API_KEY,
  BASE_URL: process.env.BASE_URL,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_REGION: process.env.S3_REGION,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  DEPLOY_ENV: process.env.DEPLOY_ENV,
  RENDER_INTERNAL_HOSTNAME: process.env.RENDER_INTERNAL_HOSTNAME,

  NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE: process.env.NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE,
  NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  NEXT_PUBLIC_V1_BASE_URL: process.env.NEXT_PUBLIC_V1_BASE_URL,
  V1_NEXTAUTH_SECRET: process.env.V1_NEXTAUTH_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ASSEMBLY_AI_API_KEY: process.env.ASSEMBLY_AI_API_KEY,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      //
      // TODO: check why this is throwing
      // 
      // // Throw a descriptive error if a server-side env var is accessed on the client
      // // Otherwise it would just be returning `undefined` and be annoying to debug
      // if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
      //   throw new Error(
      //     process.env.NODE_ENV === "production"
      //       ? "❌ Attempted to access a server-side environment variable on the client"
      //       : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
      //   );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
