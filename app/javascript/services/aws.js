import AWS from 'aws-sdk';

const creds = {
  accessKeyId: 'AKIAJ7B3NTBGNQ5UPZLQ',
  secretAccessKey: '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'
};

export const initS3 = () => {
  AWS.config.update(creds);
  return new AWS.S3();
};

export const getImageUrl = params => {
  const s3 = initS3();
  return s3.getSignedUrl('getObject', params);
};

export const getBucketObjects = (bucket, callback) => {
  const s3 = initS3();
  s3.listObjectsV2({ Bucket: bucket, Prefix: 'SGF page/' }, callback);
  // , (err, data) => {
  //   let files = [];
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     const bucketContents = data.Contents;
  //     files = bucketContents.map(b => {
  //       const urlParams = { Bucket: bucket, Key: b.Key };
  //       return {
  //         key: b.Key,
  //         url: s3.getSignedUrl('getObject', urlParams)
  //       };
  //     });
  //     // console.log(files);
  //   }
  //   return files;
  // });
};
