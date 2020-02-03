CarrierWave.configure do |config|
  # For testing, upload files to local `tmp` folder.
  if Rails.env.development?
    config.storage = :file
  elsif Rails.env.test?
    config.storage = :file
  else
    config.fog_credentials = {
        :provider               => 'AWS',
        :aws_access_key_id      => ENV['AWS_ACCESS_KEY_ID'],
        :aws_secret_access_key  => ENV['AWS_SECRET_ACCESS_KEY'],
        :region                 => 'us-west-2'
    }
    config.storage = :fog
    config.fog_directory = ENV['S3_BUCKET_NAME']
    config.fog_attributes      = {'Cache-Control' => 'max-age = 315576000'}
    config.fog_use_ssl_for_aws = false
  end
  # To let CarrierWave work on heroku
  config.cache_dir = "#{Rails.root}/tmp/uploads"
end
