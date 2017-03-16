module Fog
  module Compute
    class ProfitBricks
      class Real
        # This will start a server.
        # If the server's public IP was deallocated, then a new IP will be assigned
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * server_id<~String>      - UUID of the virtual server
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#start-a-server]
        def start_server(datacenter_id, server_id)
          request(
            :expects => [202],
            :method  => 'POST',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/start"
          )
        end
      end

      class Mock
        def start_server(datacenter_id, server_id)
          if server = data[:servers]['items'].find do |attrib|
            attrib['datacenter_id'] == datacenter_id && attrib['id'] == server_id
          end
          else
            raise Fog::Errors::NotFound, 'The requested server resource could not be found'
          end

          server['vm_state'] = 'RUNNING'
          server['state'] = 'AVAILABLE'

          response        = Excon::Response.new
          response.status = 202
          response
        end
      end
    end
  end
end
