module Fog
  module Compute
    class DigitalOcean
      class Real
        def get_image_details(image_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/v2/images/#{image_id}"
          )
        end
      end

      # noinspection RubyStringKeysInHashInspection
      class Mock
        def get_image_details(id_or_slug)
          response        = Excon::Response.new

          if [7555620, 'nifty-new-snapshot-ubuntu'].include?(id_or_slug)
            response.status = 200

            response.body = {
              'image' =>
              {
                'id' => 7555620,
                'name' => 'Nifty New Snapshot',
                'distribution' => 'Ubuntu',
                'slug' => 'nifty-new-snapshot-ubuntu',
                'public' => false,
                'regions' => [
                  'nyc2',
                  'nyc2'
                  ],
                  'created_at' => '2014-11-04T22:23:02Z',
                  'min_disk_size' => 20
                }
              }
          else
            response.status = 404
            raise(Fog::Compute::DigitalOcean::NotFound.new("Expected([200]) <=> Actual(404 Not Found)"))
          end

          response
        end
      end
    end
  end
end
