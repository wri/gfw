module Fog
  module Compute
    class ProfitBricks
      class Real
        # This will force a hard reboot of the server.
        # Do not use this method if you want to gracefully reboot the machine.
        # This is the equivalent of powering off the machine and turning it back on
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * server_id<~String>      - UUID of the virtual server
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#reboot-a-server]
        def reboot_server(datacenter_id, server_id)
          request(
            :expects => [202],
            :method  => 'POST',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/reboot"
          )
        end
      end

      class Mock
        def reboot_server(datacenter_id, server_id)
          if server = data[:servers]['items'].find do |attrib|
            attrib['datacenter_id'] == datacenter_id && attrib['id'] == server_id
          end
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
