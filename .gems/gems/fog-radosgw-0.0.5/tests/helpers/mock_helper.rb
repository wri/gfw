# Use so you can run in mock mode from the command line
#
# FOG_MOCK=true fog

if ENV["FOG_MOCK"] == "true"
  Fog.mock!
end

# if in mocked mode, fill in some fake credentials for us
if Fog.mock?
  Fog.credentials = {
    :radosgw_access_key_id            => 'radosgw_access_key_id',
    :radosgw_secret_access_key        => 'radosgw_secret_access_key',
  }.merge(Fog.credentials)
end
