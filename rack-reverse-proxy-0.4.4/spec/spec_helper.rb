$LOAD_PATH.unshift(File.dirname(__FILE__))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'lib'))
require 'rack/reverse_proxy'
require 'spec'
require 'spec/autorun'
require 'rubygems'
require 'rack/test'
require 'webmock'
require 'webmock/rspec'

Spec::Runner.configure do |config|
  WebMock.disable_net_connect!
end
