# Use so you can run in mock mode from the command line
#
# FOG_MOCK=true fog

if ENV["FOG_MOCK"] == "true"
  Fog.mock!
end

# if in mocked mode, fill in some fake credentials for us
if Fog.mock?
  Fog.credentials = {
    :rackspace_api_key                => 'rackspace_api_key',
    :rackspace_region                 => 'dfw',
    :rackspace_username               => 'rackspace_username'
  }.merge(Fog.credentials)
end
