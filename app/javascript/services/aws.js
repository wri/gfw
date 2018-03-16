import AWS from 'aws-sdk';

const creds = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
};

export const connectAWSBucket = bucket =>
  new AWS.S3({ params: { Bucket: bucket } });

export const initS3 = () => {
  AWS.config.update(creds);
  return new AWS.S3({ endpoint: 'gfw.blog.s3.amazonaws.com/SGF page' });
};

export const getImageUrl = params => {
  const s3 = initS3();
  s3.getSignedUrl('getObject', params, (err, url) => url);
};

export const getBucketObjects = bucket => {
  const s3 = initS3();
  // debugger;
  return s3.listObjects({ Bucket: bucket }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const bucketContents = data.Contents;
      bucketContents.map(b => {
        const urlParams = { Bucket: bucket, Key: b.Key };
        return s3.getSignedUrl('getObject', urlParams, (error, url) => url);
      });
    }
  });
};
