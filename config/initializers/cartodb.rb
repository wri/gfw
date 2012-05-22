
cartodb_config = {
  'host'         => ENV['CARTODB_HOST'] || 'https://ferdev.cartodb.com',
  'oauth_key'    => ENV['CARTODB_OAUTH_KEY'],
  'oauth_secret' => ENV['CARTODB_OAUTH_SECRET'],
  'username'     => ENV['CARTODB_USERNAME'],
  'password'     => ENV['CARTODB_PASSWORD']
}

config_file_path = Rails.root.join("config/cartodb_config.#{Rails.env}.yml")
cartodb_config = YAML.load_file(config_file_path) if File.exists?(config_file_path)

CartoDB::Init.start cartodb_config
