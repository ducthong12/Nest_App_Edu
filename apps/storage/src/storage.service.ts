import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import S3 from './config/s3.config';

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = S3;
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `${new Date().getTime()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);

      //
      return {
        key: key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION_ID}.amazonaws.com/${key}`,
      };
    } catch (error) {
      // Handle error appropriately
      throw error;
    }
  }
}
