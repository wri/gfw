module Fog
  module Compute
    class DigitalOcean
      class Real
        def attach_volume(volume_id, droplet_id, region)
          body = { :type => 'attach', droplet_id: droplet_id, region: region}

          encoded_body = Fog::JSON.encode(body)

          request(
            :expects => [201],
            :headers => {
              'Content-Type' => "application/json; charset=UTF-8",
            },
            :method  => 'POST',
            :path    => "v2/volumes/#{volume_id}/actions",
            :body    => encoded_body,
          )
        end

        def attach_volume_by_name(volume_name, droplet_id, region)
          body = { :type => 'attach', volume_name: volume_name, droplet_id: droplet_id, region: region}

          encoded_body = Fog::JSON.encode(body)

          request(
            :expects => [201],
            :headers => {
              'Content-Type' => "application/json; charset=UTF-8",
            },
            :method  => 'POST',
            :path    => "v2/volumes/actions",
            :body    => encoded_body,
          )
        end
      end

      class Mock
        def attach_volume(volume_id, droplet_id, region)
					response         = Excon::Response.new
					response.status  = 201
					response.body    = {
						"action" => {
							"id" => 72531856,
							"status" => "completed",
							"type" => "attach_volume",
							"started_at" => "2015-11-12T17:51:03Z",
							"completed_at" => "2015-11-12T17:51:14Z",
							"resource_id" => "null",
							"resource_type" => "volume",
							"region" => {
								"name" => "New York 1",
								"slug" => "nyc1",
								"sizes" => [
									"1gb",
									"2gb",
									"4gb",
									"8gb",
									"32gb",
									"64gb",
									"512mb",
									"48gb",
									"16gb"
								],
								"features" => [
									"private_networking",
									"backups",
									"ipv6",
									"metadata"
								],
								"available" => true
							},
							"region_slug" => "nyc1"
						}
					}

          response
        end
        def attach_volume_by_name(volume_name, droplet_id, region)
					response         = Excon::Response.new
					response.status  = 201
					response.body    = {
						"action" => {
							"id" => 72531856,
							"status" => "completed",
							"type" => "attach_volume",
							"started_at" => "2015-11-12T17:51:03Z",
							"completed_at" => "2015-11-12T17:51:14Z",
							"resource_id" => "null",
							"resource_type" => "volume",
							"region" => {
								"name" => "New York 1",
								"slug" => "nyc1",
								"sizes" => [
									"1gb",
									"2gb",
									"4gb",
									"8gb",
									"32gb",
									"64gb",
									"512mb",
									"48gb",
									"16gb"
								],
								"features" => [
									"private_networking",
									"backups",
									"ipv6",
									"metadata"
								],
								"available" => true
							},
							"region_slug" => "nyc1"
						}
					}

          response
        end
      end
    end
  end
end
