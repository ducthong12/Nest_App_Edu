import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

const S3_CONFIG = {
  region: process.env.AWS_REGION_ID,
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
  },
};

const S3 = new S3Client(S3_CONFIG);

export default S3;
