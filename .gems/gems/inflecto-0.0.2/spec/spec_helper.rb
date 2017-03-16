# encoding: utf-8

require 'rspec'
require 'inflecto'

# require spec support files and shared behavior
Dir[File.expand_path('../{support,shared}/**/*.rb', __FILE__)].each { |f| require(f) }

RSpec.configure do |config|
end
