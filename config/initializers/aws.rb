Aws.config.update({
  region: 'us-west-2',
  credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY']),
})

S3_DATA_BUCKET_NAME = Aws::S3::Resource.new.bucket(ENV['S3_DATA_BUCKET_NAME'])
