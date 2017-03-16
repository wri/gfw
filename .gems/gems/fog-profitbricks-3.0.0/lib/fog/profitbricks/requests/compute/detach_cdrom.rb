module Fog
  module Compute
    class ProfitBricks
      class Real
        # Detach a CD-ROM from the server
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the data center
        # * server_id<~String>      - UUID of the virtual server
        # * cdrom_id<~String>       - UUID of the CD-ROM image
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#detach-a-cd-rom]
        def detach_cdrom(datacenter_id, server_id, cdrom_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/cdroms/#{cdrom_id}"
          )
        end
      end

      class Mock
        def detach_cdrom(datacenter_id, server_id, cdrom_id)
          response = Excon::Response.new
          response.status = 202

          if server = data[:servers]['items'].find do |serv|
            serv['datacenter_id'] == datacenter_id && serv['id'] == server_id
          end
          else
            raise Fog::Errors::NotFound, "The server resource could not be found"
          end

          if cdrom = server['entities']['cdroms']['items'].find do |cd|
            cd['id'] == cdrom_id
          end
          else
            raise Fog::Errors::NotFound, "The attached volume resource could not be found"
          end

          response
        end
      end
    end
  end
end
