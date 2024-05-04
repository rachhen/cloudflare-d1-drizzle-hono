export type MyEnv = {
  Bindings: {
    DB: D1Database;
    MY_BUCKET: R2Bucket;
    RESEND_API_KEY: string;
    CLIENT_URL: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  };
  Variables: {};
};
