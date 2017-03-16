begin
  require 'codeclimate-test-reporter'
  CodeClimate::TestReporter.start
rescue LoadError => e
  $stderr.puts "not recording test coverage: #{e.inspect}"
end

require 'fog/test_helpers'
require File.expand_path('../../lib/fog/dynect', __FILE__)

Bundler.require(:test)

Excon.defaults.merge!(:debug_request => true, :debug_response => true)
