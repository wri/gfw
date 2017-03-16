module Fog
  module Compute
    class DigitalOcean
      class Real
        def get_volume_details(volume_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/v2/volumes/#{volume_id}"
          )
        end
      end

      # noinspection RubyStringKeysInHashInspection
      class Mock
        def get_volume_details(_)
          response        = Excon::Response.new
          response.status = 200

          response.body = {
            'volume' => {
              "id" =>  "v4-e098-11e5-ad9f-000f53306ae1",
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
              "droplet_ids" => [

              ],
              "name" => "example",
              "description" => "Block store for examples",
              "size_gigabytes" => 10,
              "created_at" => "2016-03-02T17:00:49Z"
            }
          }

          response
        end
      end
    end
  end
end
