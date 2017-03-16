module Fog
  module Compute
    class DigitalOcean
      class Real
        def list_images(filters = {})
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/v2/images",
            :query   => filters
          )
        end
      end

      # noinspection RubyStringKeysInHashInspection
      class Mock
        def list_images(filters = {})
          next_page = (filters[:page] || 1).to_i + 1

          response        = Excon::Response.new
          response.status = 200
          response.body   = {

            'images' => [
              {
                'id'            => 7555620,
                'name'          => 'Nifty New Snapshot',
                'distribution'  => 'Ubuntu',
                'slug'          => 'nifty-new-snapshot-ubuntu',
                'public'        => false,
                'regions'       => %w(nyc2 nyc3),
                'created_at'    => '2014-11-04T22:23:02Z',
                'type'          => 'snapshot',
                'min_disk_size' => 20,
              }
            ],
            'links'  => {
              'pages' => {
                'last' => 'https://api.digitalocean.com/v2/images?page=56&per_page=1',
                'next' => "https://api.digitalocean.com/v2/images?page=#{next_page}&per_page=1"
              }
            },
            'meta'   => {
              'total' => 56
            }
          }

          response
        end
      end
    end
  end
end
