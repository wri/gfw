Shindo.tests('Fog::Compute[:profitbricks] | request request', %w(profitbricks compute)) do
  @requests_schema = {
    'id'    => String,
    'type'  => String,
    'href'  => String,
    'items' => Array
  }

  @request_schema = {
    'id'          => String,
    'type'        => String,
    'href'        => String,
    'metadata'    => Hash,
    'properties'  => Hash
  }

  service = Fog::Compute[:profitbricks]

  tests('success') do
    Excon.defaults[:connection_timeout] = 500

    tests('#get_all_requests').data_matches_schema(@requests_schema) do
      data = service.get_all_requests

      @request_id = data.body['items'][0]['id']

      data.body
    end

    tests('#get_request').data_matches_schema(@request_schema) do
      data = service.get_request(@request_id)
      data.body
    end

    tests('#get_request_status').data_matches_schema(@request_schema) do
      data = service.get_request(@request_id)
      data.body
    end
  end

  tests('failure') do
    tests('#get_location').raises(ArgumentError) do
      service.get_request
    end

    tests('#get_location_status').raises(ArgumentError) do
      service.get_request_status
    end
  end
end
