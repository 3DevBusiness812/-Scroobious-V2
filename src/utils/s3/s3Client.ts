import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

const s3Client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  }
});

export { s3Client };
