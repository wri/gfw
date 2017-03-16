ENV['FOG_RC']         = ENV['FOG_RC'] || File.expand_path('~/.fog', __FILE__)
ENV['FOG_CREDENTIAL'] = ENV['FOG_CREDENTIAL'] || 'default'

## From fog-core
require 'fog/test_helpers/formats_helper'
require 'fog/test_helpers/succeeds_helper'

require 'fog/profitbricks'

Excon.defaults.merge!(:debug_request => true, :debug_response => true)

# This overrides the default 600 seconds timeout during live test runs
if Fog.mocking?
  FOG_TESTING_TIMEOUT = ENV['FOG_TEST_TIMEOUT'] || 2000
  Fog.timeout = 2000
  Fog::Logger.warning "Setting default fog timeout to #{Fog.timeout} seconds"
else
  FOG_TESTING_TIMEOUT = Fog.timeout
end
