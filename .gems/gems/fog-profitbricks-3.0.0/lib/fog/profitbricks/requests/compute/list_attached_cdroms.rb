module Fog
  module Compute
    class ProfitBricks
      class Real
        # Get a list of CD-ROMs attached to the server
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required - UUID of the datacenter
        # * server_id<~String>      - Required - UUID of the server
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #     * type<~String>                 - The type of the requested resource
        #     * href<~String>                 - URL to the object’s representation (absolute path)
        #     * items<~Hash>
        #       * id<~String>                   - The resource's unique identifier
        #       * type<~String>                 - The type of the requested resource
        #       * href<~String>                 - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>               - Hash containing the image metadata
        #         * createdDate<~String>        - The date the resource was created
        #         * createdBy<~String>          - The user who created the resource
        #         * etag<~String>               - The etag for the resource
        #         * lastModifiedDate<~String>   - The last time the resource has been modified
        #         * lastModifiedBy<~String>     - The user who last modified the resource
        #         * state<~String>              - Volume state
        #       * properties<~Hash>             - Hash containing the volume properties
        #         * name<~String>               - The name of the image
        #         * description<~String>        - The description of the image
        #         * location<~String>           - The image's location
        #         * size<~Integer>              - The size of the image in GB
        #         * cpuHotPlug<~Boolean>        - This image is capable of CPU hot plug (no reboot required)
        #         * cpuHotUnplug<~Boolean>      - This image is capable of CPU hot unplug (no reboot required)
        #         * ramHotPlug<~Boolean>        - This image is capable of memory hot plug (no reboot required)
        #         * ramHotUnplug<~Boolean>      - This image is capable of memory hot unplug (no reboot required)
        #         * nicHotPlug<~Boolean>        - This image is capable of nic hot plug (no reboot required)
        #         * nicHotUnplug<~Boolean>      - This image is capable of nic hot unplug (no reboot required)
        #         * discVirtioHotPlug<~Boolean> - This image is capable of Virt-IO drive hot plug (no reboot required)
        #         * discVirtioHotPlug<~Boolean> - This image is capable of Virt-IO drive hot unplug (no reboot required)
        #         * discScsiHotPlug<~Boolean>   - This image is capable of Scsi drive hot plug (no reboot required)
        #         * discScsiHotUnplug<~Boolean> - This image is capable of Scsi drive hot unplug (no reboot required)
        #         * licenceType<~String>        - The image's licence type: LINUX, WINDOWS, or UNKNOWN
        #         * imageType<~String>          - The type of image: HDD, CDROM
        #         * public<~String>             - Indicates if the image is part of the public repository or not
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-attached-cd-roms]
        def list_attached_cdroms(datacenter_id, server_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/cdroms?depth=1"
          )
        end
      end

      class Mock
        def list_attached_cdroms(datacenter_id, server_id)
          if server = data[:servers]['items'].find do |serv|
            serv['datacenter_id'] == datacenter_id && serv['id'] == server_id
          end
          else
            raise Fog::Errors::NotFound, "The server resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 200
          response.body   = data[:images]
          response
        end
      end
    end
  end
end
