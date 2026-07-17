import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');
    const bucket = this.configService.get<string>('MINIO_BUCKET', 'castaminofen');

    if (!endpoint || !accessKey || !secretKey) {
      throw new InternalServerErrorException('MinIO configuration is missing');
    }

    this.bucket = bucket;
    this.baseUrl = `${endpoint.replace(/\/$/, '')}/${bucket}`;
    this.client = new S3Client({
      endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async uploadAudio(key: string, buffer: Buffer, contentType: string): Promise<string> {
    try {
      await this.ensureBucketExists();
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );

      return `${this.baseUrl}/${encodeURIComponent(key)}`;
    } catch {
      throw new InternalServerErrorException('Failed to upload audio file');
    }
  }
}
