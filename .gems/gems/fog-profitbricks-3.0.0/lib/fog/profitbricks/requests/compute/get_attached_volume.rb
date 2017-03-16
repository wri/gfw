module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieve the properties of an attached volume
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required - UUID of the datacenter
        # * server_id<~String>      - Required - UUID of the server
        # * volume_id<~String>      - Required - UUID of the attached volume
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #     * type<~String>                 - The type of the requested resource
        #     * href<~String>                 - URL to the object’s representation (absolute path)
        #     * metadata<~Hash>               - Hash containing the volume metadata
        #       * createdDate<~String>        - The date the resource was created
        #       * createdBy<~String>          - The user who created the resource
        #       * etag<~String>               - The etag for the resource
        #       * lastModifiedDate<~String>   - The last time the resource has been modified
        #       * lastModifiedBy<~String>     - The user who last modified the resource
        #       * state<~String>              - Volume state
        #     * properties<~Hash>             - Hash containing the volume properties
        #       * name<~String>               - The name of the volume.
        #       * type<~String>               - The volume type, HDD or SSD.
        #       * size<~Integer>              - The size of the volume in GB.
        #       * image<~String>              - The image or snapshot ID.
        #       * imagePassword<~Boolean>     - Indicates if a password is set on the image.
        #       * bus<~String>                - The bus type of the volume (VIRTIO or IDE). Default: VIRTIO.
        #       * licenceType<~String>        - Volume licence type. ( WINDOWS, LINUX, OTHER, UNKNOWN)
        #       * cpuHotPlug<~Boolean>        - This volume is capable of CPU hot plug (no reboot required)
        #       * cpuHotUnplug<~Boolean>      - This volume is capable of CPU hot unplug (no reboot required)
        #       * ramHotPlug<~Boolean>        - This volume is capable of memory hot plug (no reboot required)
        #       * ramHotUnplug<~Boolean>      - This volume is capable of memory hot unplug (no reboot required)
        #       * nicHotPlug<~Boolean>        - This volume is capable of nic hot plug (no reboot required)
        #       * nicHotUnplug<~Boolean>      - This volume is capable of nic hot unplug (no reboot required)
        #       * discVirtioHotPlug<~Boolean> - This volume is capable of Virt-IO drive hot plug (no reboot required)
        #       * discVirtioHotPlug<~Boolean> - This volume is capable of Virt-IO drive hot unplug (no reboot required)
        #       * discScsiHotPlug<~Boolean>   - This volume is capable of Scsi drive hot plug (no reboot required)
        #       * discScsiHotUnplug<~Boolean> - This volume is capable of Scsi drive hot unplug (no reboot required)
        #       * deviceNumber<~Integer>      - The LUN ID of the storage volume
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#retrieve-an-attached-volume]
        def get_attached_volume(datacenter_id, server_id, volume_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/volumes/#{volume_id}?depth=1"
          )
        end
      end

      class Mock
        def get_attached_volume(datacenter_id, server_id, volume_id)
          if server = data[:servers]['items'].find do |serv|
            serv['datacenter_id'] == datacenter_id && serv['id'] == server_id
          end
          else
            raise Fog::Errors::NotFound, "The server resource could not be found"
          end

          if server['entities']
            volume = server['entities']['volumes']['items'].find do |vlm|
              vlm['id'] == volume_id
            end
          elsif server['volumes']
            volume = server['volumes']['items'].find do |vlm|
              vlm['id'] == volume_id
            end
          else
            raise Fog::Errors::NotFound, "The attached volume resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 200
          response.body   = volume
          response
        end
      end
    end
  end
end
