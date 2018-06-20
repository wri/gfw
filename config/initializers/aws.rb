Aws.config.update({
  region: ENV["AWS_REGION"],
  credentials: Aws::Credentials.new(ENV["AWS_ACCESS_KEY_ID"], ENV["AWS_SECRET_ACCESS_KEY"]),
  endpoint: "https://s3.amazonaws.com"
})

S3_DATA_BUCKET_NAME = Aws::S3::Resource.new.bucket(ENV["S3_DATA_BUCKET_NAME"])
