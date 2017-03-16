if ENV['COVERAGE']
  require 'coveralls'
  require 'simplecov'

  SimpleCov.command_name 'Unit Tests'

  SimpleCov.start do
    add_filter '/spec/'
    add_filter '/test/'
  end
end

require 'fog/ecloud'

if ENV['COVERAGE']
  Coveralls.wear!
end

Excon.defaults.merge!(:debug_request => true, :debug_response => true)

require File.expand_path(File.join(File.dirname(__FILE__), 'helpers', 'mock_helper'))

# This overrides the default 600 seconds timeout during live test runs
if Fog.mocking?
  FOG_TESTING_TIMEOUT = ENV['FOG_TEST_TIMEOUT'] || 2000
  Fog.timeout = 2000
  Fog::Logger.warning "Setting default fog timeout to #{Fog.timeout} seconds"
else
  FOG_TESTING_TIMEOUT = Fog.timeout
end
