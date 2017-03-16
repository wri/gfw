module Fog
  module Compute
    class ProfitBricks
      class Real
        # Deletes the specified NIC
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * server_id<~String>      - UUID of the server
        # * nic_id<~String>         - UUID of the NIC
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-a-nic]
        def delete_nic(datacenter_id, server_id, nic_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/nics/#{nic_id}"
          )
        end
      end

      class Mock
        def delete_nic(datacenter_id, server_id, nic_id)
          response = Excon::Response.new
          response.status = 202

          if nic = data[:nics]["items"].find do |attribute|
            attribute["datacenter_id"] == datacenter_id && attribute["server_id"] == server_id && attribute["id"] == nic_id
          end
          else
            raise Fog::Errors::NotFound, "The requested nic resource could not be found"
          end

          response
        end
      end
    end
  end
end
