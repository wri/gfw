module Fog
  module Compute
    class ProfitBricks
      class Real
        # Delete virtual data center
        #
        # ==== Parameters
        # * datacenter_id<~String> - The UUID of the data center
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-a-data-center]
        def delete_datacenter(datacenter_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}"
          )
        end
      end

      class Mock
        def delete_datacenter(datacenter_id)
          response = Excon::Response.new
          response.status = 202

          if dc = data[:datacenters]["items"].find do |datacenter|
            datacenter["id"] == datacenter_id
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
