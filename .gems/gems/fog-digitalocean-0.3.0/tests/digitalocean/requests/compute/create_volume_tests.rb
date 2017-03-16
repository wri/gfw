Shindo.tests('Fog::Compute::DigitalOcean | create_volume request', ['digitalocean', 'compute']) do
  service = Fog::Compute.new(:provider => 'DigitalOcean')

  tests('success') do
    tests('creates a new volume') do
      response = service.create_volume({ name: "test" })
      response.body['result'] == 'success'
    end
  end
end
