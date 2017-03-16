Fog.mock! if ENV['FOG_MOCK'] == 'true'

if Fog.mock?
  Fog.credentials = {
    :vsphere_server   => 'fake_vsphere_server',
    :vsphere_username => 'fake_vsphere_username',
    :vsphere_password => 'fake_vsphere_password'
  }.merge(Fog.credentials)
end
