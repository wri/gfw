Shindo.tests('Fog::Compute::DigitalOcean | attach_volume request', ['digitalocean', 'compute']) do
  service = Fog::Compute.new(:provider => 'DigitalOcean')

  tests('success') do
    tests('creates a new volume') do
      response = service.attach_volume(1, 1, 'nyc1')
      response.body['result'] == 'success'
    end
  end
end
