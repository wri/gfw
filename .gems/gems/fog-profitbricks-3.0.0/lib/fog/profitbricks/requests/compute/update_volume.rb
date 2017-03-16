module Fog
  module Compute
    class ProfitBricks
      class Real
        # Update a virtual storage
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required, UUID of virtual data center
        # * volume_id<~String>      - Required, UUID of volume
        # * options<~Hash>:
        #   * name<~String>           - The name of the volume
        #   * size<~Integer>          - Required, the size of the volume in GB
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
        #       * imagePassword<~String>      - Indicates if a password is set on the image.
        #       * sshKeys<~String>	          - SSH keys
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
        #       * deviceNumber<~Integer>      - The LUN ID of the volume volume
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#update-volume]
        def update_volume(datacenter_id, volume_id, options = {})
          request(
            :expects => [202],
            :method  => 'PATCH',
            :path    => "/datacenters/#{datacenter_id}/volumes/#{volume_id}",
            :body    => Fog::JSON.encode(options)
          )
        end
      end

      class Mock
        def update_volume(datacenter_id, volume_id, options = {})
          if volume = data[:volumes]['items'].find do |vlm|
            vlm["id"] == volume_id && vlm["datacenter_id"] == datacenter_id
          end
            volume['name'] = options[:name]
            volume['size'] = options[:size]
          else
            raise Excon::Error::HTTPStatus, 'The requested resource could not be found'
          end

          response        = Excon::Response.new
          response.status = 202
          response.body   = volume

          response
        end
      end
    end
  end
end
