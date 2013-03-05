CarrierWave.configure do |config|
  config.fog_credentials = {
    :provider               => 'AWS',
    :aws_access_key_id      => ENV['S3_KEY_ID'],
    :aws_secret_access_key  => ENV['S3_KEY_SECRET']
  }
  config.fog_directory       = 'gfw.stories'
  config.fog_attributes      = {'Cache-Control' => 'max-age = 315576000'}
  config.fog_use_ssl_for_aws = false
end
