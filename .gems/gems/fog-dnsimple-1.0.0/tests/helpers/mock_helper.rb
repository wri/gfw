Fog.mock! if ENV['FOG_MOCK'] == 'true'

if Fog.mock?
  Fog.credentials = {
  }.merge(Fog.credentials)
end
