Shindo.tests('Fog::Compute[:profitbricks] | location request', %w(profitbricks compute)) do
  @locations_schema = {
    'id'          => String,
    'type'        => String,
    'href'        => String,
    'items'       => Array
  }

  @location_schema = {
    'id'          => String,
    'type'        => String,
    'href'        => String,
    'properties'  => {
      'name' => String,
      'features' => Array
    }
  }

  service = Fog::Compute[:profitbricks]

  tests('success') do
    Excon.defaults[:connection_timeout] = 500

    tests('#get_all_locations').data_matches_schema(@locations_schema) do
      data = service.get_all_locations
      @location_id = data.body['items'][0]['id']

      data.body
    end

    # tests('#get_location').data_matches_schema(@location_schema) do
    #   data = service.get_location("us/las")
    #   data.body
    # end
  end

  tests('failure') do
    tests('#get_location').raises(Excon::Error::HTTPStatus) do
      data = service.get_location('oo/ooo')
    end
  end
end
