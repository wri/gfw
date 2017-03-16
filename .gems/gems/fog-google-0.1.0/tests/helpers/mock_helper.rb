# Use so you can run in mock mode from the command line
#
# FOG_MOCK=true fog

if ENV["FOG_MOCK"] == "true"
  Fog.mock!
end

# if in mocked mode, fill in some fake credentials for us
if Fog.mock?
  Fog.credentials = {
    :google_storage_access_key_id     => 'google_storage_access_key_id',
    :google_storage_secret_access_key => 'google_storage_secret_access_key',
    :google_project                   => 'google_project_name',
    :google_client_email              => 'fake@developer.gserviceaccount.com',
    :google_key_location              => '~/fake.p12',
  }.merge(Fog.credentials)
end
