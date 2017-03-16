module Fog
  module Compute
    class ProfitBricks
      class Real
        # Deletes the specified volume
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * volume_id<~String>      - UUID of the volume
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-volume]
        def delete_volume(datacenter_id, volume_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/volumes/#{volume_id}"
          )
        end
      end

      class Mock
        def delete_volume(datacenter_id, volume_id)
          response = Excon::Response.new
          response.status = 202

          if vlm = data[:volumes]["items"].find do |volume|
            volume["id"] == volume_id && volume["datacenter_id"] == datacenter_id
          end
          else
            raise Excon::Error::HTTPStatus, "The requested resource could not be found"
          end

          response
        end
      end
    end
  end
end
