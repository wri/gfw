Fog.mock! if ENV["FOG_MOCK"] == "true"

if Fog.mock?
  Fog.credentials = {
    :profitbricks_username => "username",
    :profitbricks_password => "abc123xyz"
  }.merge(Fog.credentials)
end
