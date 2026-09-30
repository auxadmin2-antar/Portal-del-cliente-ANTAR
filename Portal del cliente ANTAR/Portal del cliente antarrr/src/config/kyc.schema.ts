import { z } from "zod";

const flag = z.enum(["true", "false"]).default("false");
const megabytes = (fallback: number) => z.coerce.number().min(0.5).max(20).default(fallback);
const optional = z.string().trim().optional().transform(value => value || undefined);

const schema = z.object({
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  SMTP_HOST: z.string().trim().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(465),
  SMTP_USER: optional,
  SMTP_PASS: optional,
  MAIL_FROM: optional,
  KYC_MAIL_TO: optional,
  TURNSTILE_SITE_KEY: optional,
  TURNSTILE_SECRET_KEY: optional,
  // Vercel limita el cuerpo de una función a 4.5 MB: 4 MB de archivos deja margen para el formulario.
  KYC_MAX_TOTAL_MB: megabytes(4),
  KYC_MAX_FILE_MB: megabytes(4),
  KYC_RATE_LIMIT: z.coerce.number().int().min(1).max(1000).default(5),
  KYC_TRUST_PROXY: flag,
  KYC_DRY_RUN: flag,
  KYC_OUTPUT_DIR: optional,
});

export type KycConfig = ReturnType<typeof readKycConfig>;

const emailList = (value: string | undefined) => (value ?? "").split(",").map(item => item.trim()).filter(Boolean);

/** Lee la configuración sin incluir valores secretos en los mensajes de error. */
export function readKycConfig(values: Record<string, string | undefined>) {
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const keys = [...new Set(parsed.error.issues.map(issue => String(issue.path[0])))].join(", ");
    throw new Error(`Invalid KYC configuration: ${keys}`);
  }
  const env = parsed.data;
  const production = env.VERCEL_ENV === "production";
  const recipients = emailList(env.KYC_MAIL_TO);
  if (recipients.some(address => !z.email().safeParse(address).success)) throw new Error("Invalid KYC configuration: KYC_MAIL_TO");
  if (recipients.length > 20) throw new Error("Invalid KYC configuration: KYC_MAIL_TO admits up to 20 recipients");

  const mail = env.SMTP_USER && env.SMTP_PASS && recipients.length
    ? { host: env.SMTP_HOST, port: env.SMTP_PORT, user: env.SMTP_USER, pass: env.SMTP_PASS, from: env.MAIL_FROM ?? env.SMTP_USER, to: recipients }
    : null;
  if ((env.SMTP_USER || env.SMTP_PASS) && !mail) throw new Error("Invalid KYC configuration: SMTP_USER, SMTP_PASS and KYC_MAIL_TO go together");

  const captcha = env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY ? { siteKey: env.TURNSTILE_SITE_KEY, secret: env.TURNSTILE_SECRET_KEY } : null;
  if ((env.TURNSTILE_SITE_KEY || env.TURNSTILE_SECRET_KEY) && !captcha) throw new Error("Invalid KYC configuration: TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY go together");

  const dryRun = env.KYC_DRY_RUN === "true";
  if (production) {
    if (!mail) throw new Error("Production requires SMTP_USER, SMTP_PASS and KYC_MAIL_TO");
    if (!captcha) throw new Error("Production requires TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY");
    if (dryRun || env.KYC_OUTPUT_DIR) throw new Error("Production cannot use KYC_DRY_RUN or KYC_OUTPUT_DIR");
  }
  if (!mail && !dryRun) throw new Error("Configure SMTP_USER, SMTP_PASS and KYC_MAIL_TO, or set KYC_DRY_RUN=true for local tests");

  const maxFileBytes = Math.round(env.KYC_MAX_FILE_MB * 1_048_576);
  const maxTotalBytes = Math.round(env.KYC_MAX_TOTAL_MB * 1_048_576);
  return {
    production,
    mail,
    captcha,
    dryRun,
    outputDir: dryRun ? env.KYC_OUTPUT_DIR : undefined,
    rateLimitPerHour: env.KYC_RATE_LIMIT,
    trustProxy: env.KYC_TRUST_PROXY === "true",
    limits: { maxFileBytes: Math.min(maxFileBytes, maxTotalBytes), maxTotalBytes },
  };
}
