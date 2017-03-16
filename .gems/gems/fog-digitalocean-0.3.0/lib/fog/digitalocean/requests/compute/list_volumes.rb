module Fog
  module Compute
    class DigitalOcean
      class Real
        def list_volumes(filters = {})
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/v2/volumes",
            :query   => filters
          )
        end
      end

      # noinspection RubyStringKeysInHashInspection
      class Mock
        def list_volumes(filters = {})
          response        = Excon::Response.new
					response.status = 200
					response.body   = {
						"volumes" => [
							{
								"id" => "506f78a4-e098-11e5-ad9f-000f53306ae1",
								"region" => {
									"name" => "New York 1",
									"slug" =>"nyc1",
									"sizes" => [
										"512mb",
										"1gb",
										"2gb",
										"4gb",
										"8gb",
										"16gb",
										"32gb",
										"48gb",
										"64gb"
									],
									"features" => [
										"private_networking",
										"backups",
										"ipv6",
										"metadata"
									],
									"available" => true
								},
								"droplet_ids" => [],
								"name" =>"example",
								"description" =>"Block store for examples",
								"size_gigabytes" =>10,
								"created_at" =>"2016-03-02T17:00:49Z"
							}
						],
						"links" => {},
						"meta" => {
							"total" => 1
						}
					}

          response
        end
      end
    end
  end
end
