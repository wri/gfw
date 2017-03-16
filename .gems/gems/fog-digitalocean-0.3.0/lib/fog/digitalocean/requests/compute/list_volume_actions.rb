module Fog
  module Compute
    class DigitalOcean
      class Real
        def list_volume_actions(id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "v2/volumes/#{id}/actions",
          )
        end
      end

      class Mock
        def list_volume_actions(id)
          response        = Excon::Response.new
          response.status = 201
          response.body   = {
            "actions" => [
              {
                "id" => 72531856,
                "status" => "completed",
                "type" => "attach_volume",
                "started_at" => "2015-11-21T21:51:09Z",
                "completed_at" => "2015-11-21T21:51:09Z",
                "resource_id" => nil,
                "resource_type" => "volume",
                "region" => {
                  "name" => "New York 1",
                  "slug" => "nyc1",
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
                "region_slug" => "nyc1"
              }
            ],
            "links" => {
            },
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
