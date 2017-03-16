module Fog
  module Compute
    class ProfitBricks
      class Real
        # This will remove a server from a data center.
        # NOTE: This will not automatically remove the storage volume(s)
        # attached to a server. A separate API call is required to perform that action.
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * server_id<~String>      - UUID of the virtual server
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-a-server]
        def delete_server(datacenter_id, server_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}"
          )
        end
      end

      class Mock
        def delete_server(datacenter_id, server_id)
          if server = data[:servers]['items'].find do |attrib|
            attrib['datacenter_id'] == datacenter_id && attrib['id'] == server_id
          end
            data[:servers].delete(server)
          else
            raise Fog::Errors::NotFound, 'The requested server resource could not be found'
          end

          response        = Excon::Response.new
          response.status = 202
          response
        end
      end
    end
  end
end
