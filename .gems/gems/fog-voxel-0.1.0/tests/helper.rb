require 'excon'

if ENV['COVERAGE']
  require 'coveralls'
  require 'simplecov'

  SimpleCov.start do
    add_filter '/spec/'
    add_filter '/test/'
  end
end

require File.expand_path(File.join(File.dirname(__FILE__), '../lib/fog/voxel'))

Coveralls.wear! if ENV['COVERAGE']

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

def lorem_file
  File.open(File.dirname(__FILE__) + '/lorem.txt', 'r')
end

def array_differences(array_a, array_b)
  (array_a - array_b) | (array_b - array_a)
end