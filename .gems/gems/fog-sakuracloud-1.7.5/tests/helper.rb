## Initialize credentials
ENV['FOG_RC'] = ENV['FOG_RC'] || File.expand_path('../.fog', __FILE__)

## From fog-core
require 'fog/test_helpers'
require 'fog/sakuracloud'

if ENV['CI']
  Fog.credentials[:sakuracloud_api_token]        = 'dummy_token'
  Fog.credentials[:sakuracloud_api_token_secret] = 'dummy_secret'
end

## SakuraCloud Helpers
def sakuracloud_volume_service
  Fog::Volume[:sakuracloud]
end

def sakuracloud_compute_service
  Fog::Compute[:sakuracloud]
end

def sakuracloud_network_service
  Fog::Network[:sakuracloud]
end
