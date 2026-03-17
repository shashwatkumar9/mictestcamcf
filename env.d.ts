interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  IMAGES: ImagesBinding;
  WORKER_SELF_REFERENCE: Fetcher;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_SECURE: string;
  FROM_EMAIL: string;
  CONTACT_EMAIL: string;
  NEXT_PUBLIC_APP_URL: string;
}
