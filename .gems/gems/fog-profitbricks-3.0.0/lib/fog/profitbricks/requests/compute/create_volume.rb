module Fog
  module Compute
    class ProfitBricks
      class Real
        # Creates a volume within the data center. This will NOT attach the volume to a server.
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required, UUID of virtual data center
        # * options<~Hash>:
        #   * name<~String>           - The name of the volume
        #   * size<~Integer>          - Required, the size of the volume in GB
        #   * bus<~String>            - The bus type of the volume (VIRTIO or IDE). Default: VIRTIO.
        #   * image<~String>          - Required**, the image or snapshot ID
        #   * type<~String>           - The volume type, HDD or SSD
        #   * licenceType<~String>    - Required**, the licence type of the volume. Options: LINUX, WINDOWS, UNKNOWN, OTHER
        #   * imagePassword<~String>  - One-time password is set on the Image for the appropriate account.
        #                               This field may only be set in creation requests. When reading, it always returns null.
        #                               Password has to contain 8-50 characters.
        #                               Only these characters are allowed: [abcdefghjkmnpqrstuvxABCDEFGHJKLMNPQRSTUVX23456789]
        #   * sshKeys<~String>        - SSH keys to allow access to the volume via SSH
        #
        #   ** Either the image or the licenceType parameters need to be provided.
        #      licenceType is required, but if image is supplied, it will already have a licenceType set.
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #     * type<~String>                 - The type of the created resource
        #     * href<~String>                 - URL to the object's representation (absolute path)
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
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#create-volume]
        def create_volume(datacenter_id, options = {})
          volume = {
            :properties => options
          }

          request(
            :expects => [202],
            :method   => 'POST',
            :path     => "/datacenters/#{datacenter_id}/volumes",
            :body     => Fog::JSON.encode(volume)
          )
        end
      end

      class Mock
        def create_volume(datacenter_id, options = {})
          response = Excon::Response.new
          response.status = 202

          if datacenter = data[:datacenters]['items'].find do |attrib|
            attrib['id'] == datacenter_id
          end

            datacenter['version'] += 1 if datacenter['version']
          else
            raise Fog::Errors::NotFound, 'Data center resource could not be found'
          end

          volume_id = Fog::UUID.uuid

          volume = {
            'id' => volume_id,
            'type'      => 'volume',
            'href'      => "https=>//api.profitbricks.com/rest/v2/datacenters/#{datacenter['id']}/volumes/#{volume_id}",
            'metadata'  => {
              'createdDate' => '2015-03-18T19=>00=>51Z',
              'createdBy'         => 'test@stackpointcloud.com',
              'etag'              => 'c4a2fde6ba91a038ff953b939cc21efe',
              'lastModifiedDate'  => '2015-03-18T19=>00=>51Z',
              'lastModifiedBy'    => 'test@stackpointcloud.com',
              'state'             => 'AVAILABLE'
            },
            'properties' => {
              'name' => options[:name],
              'type'                => options[:type],
              'size'                => options[:size],
              'image'               => options[:image],
              'availabilityZone'    => options[:availabilityZone],
              'bus'                 => 'VIRTIO',
              'licenceType'         => 'OTHER',
              'cpuHotPlug'          => 'true',
              'cpuHotUnplug'        => 'false',
              'ramHotPlug'          => 'false',
              'ramHotUnplug'        => 'false',
              'nicHotPlug'          => 'true',
              'nicHotUnplug'        => 'true',
              'discVirtioHotPlug'   => 'true',
              'discVirtioHotUnplug' => 'true',
              'discScsiHotPlug'     => 'false',
              'discScsiHotUnplug'   => 'false',
              'deviceNumber'        => 1
            },
            'datacenter_id' => datacenter['id']
          }

          data[:volumes]['items'] << volume

          response.body = volume
          response
        end
      end
    end
  end
end
