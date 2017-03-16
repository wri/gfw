begin
  require 'codeclimate-test-reporter'
  CodeClimate::TestReporter.start
rescue LoadError => e
  $stderr.puts "not recording test coverage: #{e.inspect}"
end

require 'fog/test_helpers'
require File.expand_path('../../lib/fog/dnsimple', __FILE__)

Excon.defaults.merge!(:debug_request => true, :debug_response => true)
