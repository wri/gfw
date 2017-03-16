module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieve a list of all volumes
        #
        # ==== Parameters
        # * datacenter_id - UUID of the datacenter which contains the volumes
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - Id of the requested resource
        #     * type<~String>                 - type of the requested resource
        #     * href<~String>                 - url to the requested resource
        #     * items<~Array>
        #       * id<~String>                   - The resource's unique identifier
        #       * type<~String>                 - The type of the requested resource
        #       * href<~String>                 - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>               - Hash containing the volume metadata
        #         * createdDate<~String>        - The date the resource was created
        #         * createdBy<~String>          - The user who created the resource
        #         * etag<~String>               - The etag for the resource
        #         * lastModifiedDate<~String>   - The last time the resource has been modified
        #         * lastModifiedBy<~String>     - The user who last modified the resource
        #         * state<~String>              - Volume state
        #       * properties<~Hash>             - Hash containing the volume properties
        #         * name<~String>               - The name of the volume.
        #         * type<~String>               - The volume type, HDD or SSD.
        #         * size<~Integer>              - The size of the volume in GB.
        #         * image<~String>              - The image or snapshot ID.
        #         * imagePassword<~Boolean>     - Indicates if a password is set on the image.
        #         * bus<~String>                - The bus type of the volume (VIRTIO or IDE). Default: VIRTIO.
        #         * licenceType<~String>        - Volume licence type. ( WINDOWS, LINUX, OTHER, UNKNOWN)
        #         * cpuHotPlug<~Boolean>        - This volume is capable of CPU hot plug (no reboot required)
        #         * cpuHotUnplug<~Boolean>      - This volume is capable of CPU hot unplug (no reboot required)
        #         * ramHotPlug<~Boolean>        - This volume is capable of memory hot plug (no reboot required)
        #         * ramHotUnplug<~Boolean>      - This volume is capable of memory hot unplug (no reboot required)
        #         * nicHotPlug<~Boolean>        - This volume is capable of nic hot plug (no reboot required)
        #         * nicHotUnplug<~Boolean>      - This volume is capable of nic hot unplug (no reboot required)
        #         * discVirtioHotPlug<~Boolean> - This volume is capable of Virt-IO drive hot plug (no reboot required)
        #         * discVirtioHotPlug<~Boolean> - This volume is capable of Virt-IO drive hot unplug (no reboot required)
        #         * discScsiHotPlug<~Boolean>   - This volume is capable of Scsi drive hot plug (no reboot required)
        #         * discScsiHotUnplug<~Boolean> - This volume is capable of Scsi drive hot unplug (no reboot required)
        #         * deviceNumber<~Integer>      - The LUN ID of the storage volume
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-volumes]
        def get_all_volumes(datacenter_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/datacenters/#{datacenter_id}/volumes?depth=5"
          )
        end
      end

      class Mock
        def get_all_volumes(datacenter_id)
          volumes = data[:volumes]

          if vlms = data[:volumes]['items'].select do |attrib|
            attrib['datacenter_id'] == datacenter_id
          end
          else
            raise Fog::Errors::NotFound, 'Volume resource could not be found'
          end

          volumes['items'] = vlms
          response        = Excon::Response.new
          response.status = 200
          response.body   = data[:volumes]

          response
        end
      end
    end
  end
end
