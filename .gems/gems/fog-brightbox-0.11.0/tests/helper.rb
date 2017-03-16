ENV["FOG_RC"]         = ENV["FOG_RC"] || File.expand_path("../.fog", __FILE__)
ENV["FOG_CREDENTIAL"] = ENV["FOG_CREDENTIAL"] || "default"

require "fog/brightbox"

Excon.defaults.merge!(:debug_request => true, :debug_response => true)

require File.expand_path(File.join(File.dirname(__FILE__), "helpers", "mock_helper"))
