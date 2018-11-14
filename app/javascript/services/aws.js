import S3 from 'aws-sdk/clients/s3';
import { config } from 'aws-sdk/lib/core';

const creds = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
};

export const initS3 = () => {
  config.update(creds);
  return new S3();
};

export const getImageUrl = params => {
  const s3 = initS3();
  return s3.getSignedUrl('getObject', params);
};

export const getBucketObjects = (bucket, callback, prefix) => {
  const s3 = initS3();
  s3.listObjectsV2({ Bucket: bucket, Prefix: prefix }, callback);
};
