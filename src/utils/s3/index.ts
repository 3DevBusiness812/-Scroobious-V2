import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { env } from "~/env.mjs";

export const createUploadSignedUrl = async (fileName: string) => {
  const bucketParams = {
    Bucket: env.S3_BUCKET_NAME,
    Key: `${nanoid()}_${fileName}`,
  };

  const command = new PutObjectCommand(bucketParams);
  const signedUrl = await getSignedUrl(s3Client, command);

  return signedUrl;
}

// Proxy to S3 resources to avoid CORS and caching issues
export const proxyS3Resource = (url?: string) => {
  return url ? `/api/s3/proxy?url=${encodeURIComponent(url)}` : ""
}
