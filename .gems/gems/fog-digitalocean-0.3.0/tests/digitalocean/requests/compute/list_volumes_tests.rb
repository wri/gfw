Shindo.tests('Fog::Compute::DigitalOcean | list_volumes request', ['digitalocean', 'compute']) do
  service = Fog::Compute.new(:provider => 'DigitalOcean')

  volume_format = {
    'id' => String,
    'region' => Hash,
    'droplet_ids' => Array,
    'name' => String,
    'description' => String,
    'size_gigabytes' => Integer,
    'created_at' => String
  }

  tests('success') do
    tests('#list_volumes') do
      service.list_volumes.body['volumes'].each do |volume|
        tests('format').data_matches_schema(volume_format) do
          volume
        end
      end
    end
  end
end
