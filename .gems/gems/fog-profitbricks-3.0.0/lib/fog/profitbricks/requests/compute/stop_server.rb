module Fog
  module Compute
    class ProfitBricks
      class Real
        # This will stop a server.
        # The machine will be forcefully powered off, billing will cease,
        # and the public IP, if one is allocated, will be deallocated
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * server_id<~String>      - UUID of the virtual server
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#stop-a-server]
        def stop_server(datacenter_id, server_id)
          request(
            :expects => [202],
            :method  => 'POST',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/stop"
          )
        end
      end

      class Mock
        def stop_server(datacenter_id, server_id)
          if server = data[:servers]['items'].find do |attrib|
            attrib['datacenter_id'] == datacenter_id && attrib['id'] == server_id
          end
          else
            raise Fog::Errors::NotFound, 'The requested server resource could not be found'
          end

          server['vm_state'] = 'SHUTOFF'
          server['state'] = 'INACTIVE'

          response        = Excon::Response.new
          response.status = 202
          response
        end
      end
    end
  end
end
