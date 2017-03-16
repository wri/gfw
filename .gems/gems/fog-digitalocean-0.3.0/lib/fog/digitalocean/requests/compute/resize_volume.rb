module Fog
  module Compute
    class DigitalOcean
      class Real
        def resize_volume(volume_id, size, region)
          body = { :type => 'resize', size_gigabytes: size, region: region}

          encoded_body = Fog::JSON.encode(body)

          request(
            :expects => [201],
            :headers => {
              'Content-Type' => "application/json; charset=UTF-8",
            },
            :method  => 'POST',
            :path    => "v2/images/#{volume_id}/actions",
            :body    => encoded_body,
          )
        end
      end

      class Mock
        def resize_volume(volume_id, size, region)
					response         = Excon::Response.new
					response.status  = 201
          response.body    = {
            "action" => {
              "id" => 72531856,
              "status" => "in-progress",
              "type" => "resize",
              "started_at" => "2015-11-12T17:51:03Z",
              "completed_at" => "2015-11-12T17:51:14Z",
              "resource_id" => nil,
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
