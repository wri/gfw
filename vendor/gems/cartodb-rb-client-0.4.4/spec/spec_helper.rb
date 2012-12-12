require 'rubygems'

$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'lib'))
$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'rspec'
require 'yaml'
require 'cartodb-rb-client'
require 'cartodb-rb-client/cartodb'
require 'active_support/core_ext/array/random_access.rb'

cartodb_config = {
  'host'         => 'https://cartodb-rb-client.cartodb.com',
  'oauth_key'    => ENV['CARTODB_OAUTH_KEY'],
  'oauth_secret' => ENV['CARTODB_OAUTH_SECRET'],
  'username'     => ENV['CARTODB_USERNAME'],
  'password'     => ENV['CARTODB_PASSWORD']
}

if File.exists?("#{File.dirname(__FILE__)}/support/cartodb_config.yml")
  cartodb_config = YAML.load_file("#{File.dirname(__FILE__)}/support/cartodb_config.yml")
end
CartoDB::Settings = cartodb_config
CartoDB::Connection = CartoDB::Client::Connection::Base.new unless defined? CartoDB::Connection
# CartoDB::Settings = YAML.load_file("#{File.dirname(__FILE__)}/support/database.yml") unless defined? CartoDB::Settings
# CartoDB::Connection = CartoDB::Client::Connection::Base.new unless defined? CartoDB::Connection

RgeoFactory = ::RGeo::Geographic.spherical_factory(:srid => 4326)

require "#{File.dirname(__FILE__)}/support/cartodb_helpers.rb"
require "#{File.dirname(__FILE__)}/support/cartodb_factories.rb"

require 'vcr'
VCR.configure do |c|
  c.default_cassette_options = { :record => :new_episodes }
  c.cassette_library_dir = 'spec/fixtures/cassettes'
  c.hook_into :typhoeus
  #c.preserve_exact_body_bytes
  c.configure_rspec_metadata!
end

RSpec.configure do |config|
  config.before(:each) do
    VCR.use_cassette('clean tables') do
      drop_all_cartodb_tables
    end
  end

  config.after(:all) do
    VCR.use_cassette('clean tables') do
      drop_all_cartodb_tables
    end
  end

end
