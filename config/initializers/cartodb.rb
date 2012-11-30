
cartodb_config = {
  'host'    => ENV['CARTODB_HOST'] || 'https://ferdev.cartodb.com',
  'api_key' => ENV['CARTODB_API_KEY']
}

config_file_path = Rails.root.join("config/cartodb_config.#{Rails.env}.yml")
cartodb_config = YAML.load_file(config_file_path) if File.exists?(config_file_path)

CartoDB::Init.start cartodb_config
