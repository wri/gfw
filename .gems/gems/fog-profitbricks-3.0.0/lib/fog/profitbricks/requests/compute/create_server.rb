module Fog
  module Compute
    class ProfitBricks
      class Real
        # Creates a server within an existing data center.
        # Additional properties such as specifying a boot volume and
        # connecting the server to an existing LAN can be configured.
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required - UUID of virtual data center
        # * properties<~Hash>:      - A hash containing the server properties
        #   * name<~String>   - Required - The hostname of the server
        #   * cores<~Integer> - Required - The total number of cores for the server
        #   * ram<~Integer>   - Required - The amount of memory for the server in MB, e.g. 2048.
        #                                  Size must be specified in multiples of 256 MB with a minimum of 256 MB;
        #                                  however, if ramHotPlug is set to TRUE then a minimum of 1024 MB nust be used
        #   * availabilityZone<~String>  - The availability zone for the server (AUTO, ZONE_1, ZONE_2)
        #   * bootCdrom<~Hash>           - Reference to a CD-ROM used for booting. If not 'null' then bootVolume has to be 'null'
        #   * bootVolume<~Hash>          - Reference to a Volume used for booting. If not 'null’ then bootCdrom has to be 'null’
        #   * cpuFamily<~String>         - Type of CPU assigned ("AMD_OPTERON" or "INTEL_XEON")
        # * entities<~Hash>:        - A hash containing the server entities
        #   * cdroms<~Hash>             - A collection of cdroms attached to the server
        #   * volumes<~Hash>            - A collection of volumes attached to the server
        #   * nics<~Hash>               - A collection of NICs attached to the server
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #       * type<~String>                 - The type of the requested resource
        #       * href<~String>                 - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>               - A hash containing the server metadata
        #         * createdDate<~String>          - The date the resource was created
        #         * createdBy<~String>            - The user who created the resource
        #         * etag<~String>                 - The etag
        #         * lastModifiedDate<~String>     - The last modified time for the resource
        #         * lastModifiedBy<~String>       - The user who last modified the resource
        #         * state<~String>                - Status of the virtual Machine
        #       * properties<~Hash>             - A hash containing the server properties
        #         * name<~String>                 - The name of the server
        #         * cores<~Integer>               - The number of cores for the server
        #         * ram<~Integer>                 - The amount of memory on the server (in megabytes)
        #         * availabilityZone<~String>     - The availability zone for the server
        #         * vmState<~String>              - The current state of the instance
        #         * bootCdrom<~Hash>              - Reference to a CD-ROM used for booting. If not 'null' then bootVolume has to be 'null'.
        #         * bootVolume<~Hash>             - Reference to a Volume used for booting. If not ‘null’ then bootCdrom has to be ‘null’
        #           * id<~String>                   - The resource's unique identifier
        #           * type<~String>                 - The type of the requested resource
        #           * href<~String>                 - URL to the object’s representation (absolute path)
        #           * metadata<~Hash>               - Hash containing the volume metadata
        #             * createdDate<~String>        - The date the resource was created
        #             * createdBy<~String>          - The user who created the resource
        #             * etag<~String>               - The etag for the resource
        #             * lastModifiedDate<~String>   - The last time the resource has been modified
        #             * lastModifiedBy<~String>     - The user who last modified the resource
        #             * state<~String>              - Volume state
        #           * properties<~Hash>             - Hash containing the volume properties
        #             * name<~String>               - The name of the volume.
        #             * type<~String>               - The volume type, HDD or SSD.
        #             * size<~Integer>              - The size of the volume in GB.
        #             * image<~String>              - The image or snapshot ID.
        #             * imagePassword<~String>      - Indicates if a password is set on the image.
        #             * sshKeys<~String>	          - SSH keys
        #             * bus<~String>                - The bus type of the volume (VIRTIO or IDE). Default: VIRTIO.
        #             * licenceType<~String>        - Volume licence type. ( WINDOWS, LINUX, OTHER, UNKNOWN)
        #             * cpuHotPlug<~Boolean>        - This volume is capable of CPU hot plug (no reboot required)
        #             * cpuHotUnplug<~Boolean>      - This volume is capable of CPU hot unplug (no reboot required)
        #             * ramHotPlug<~Boolean>        - This volume is capable of memory hot plug (no reboot required)
        #             * ramHotUnplug<~Boolean>      - This volume is capable of memory hot unplug (no reboot required)
        #             * nicHotPlug<~Boolean>        - This volume is capable of nic hot plug (no reboot required)
        #             * nicHotUnplug<~Boolean>      - This volume is capable of nic hot unplug (no reboot required)
        #             * discVirtioHotPlug<~Boolean> - This volume is capable of Virt-IO drive hot plug (no reboot required)
        #             * discVirtioHotPlug<~Boolean> - This volume is capable of Virt-IO drive hot unplug (no reboot required)
        #             * discScsiHotPlug<~Boolean>   - This volume is capable of Scsi drive hot plug (no reboot required)
        #             * discScsiHotUnplug<~Boolean> - This volume is capable of Scsi drive hot unplug (no reboot required)
        #             * deviceNumber<~Integer>      - The LUN ID of the storage volume
        #         * cpuFamily<~String>            - 	Type of CPU assigned
        #       * entities<~Hash>               - A hash containing the server entities
        #         * cdroms<~Hash>             - A collection of cdroms attached to the server
        #           * id<~String>               - The resource's unique identifier
        #           * type<~String>             - The type of the requested resource
        #           * href<~String>             - URL to the object’s representation (absolute path)
        #           * items<~Array>             - The array containing individual cd rom resources
        #         * volumes<~Hash>            - A collection of volumes attached to the server
        #           * id<~String>               - The resource's unique identifier
        #           * type<~String>             - The type of the requested resource
        #           * href<~String>             - URL to the object’s representation (absolute path)
        #           * items<~Array>             - The array containing individual volume resources (see bootVolume for detailed structure)
        #         * nics<~Hash>               - A collection of NICs attached to the server
        #           * id<~String>               - The resource's unique identifier
        #           * type<~String>             - The type of the requested resource
        #           * href<~String>             - URL to the object’s representation (absolute path)
        #           * items<~Array>             - An array containing individual NIC resources
        #             * id<~String>               - The resource's unique identifier
        #             * type<~String>             - The type of the requested resource
        #             * href<~String>             - URL to the object’s representation (absolute path)
        #             * metadata<~Hash>           - A hash containing the nic metadata
        #               * createdDate<~String>      - The date the resource was created
        #               * createdBy<~String>        - The user who created the resource
        #               * etag<~String>             - The etag for the resource
        #               * lastModifiedDate<~String> - The last time the resource has been modified
        #               * lastModifiedBy<~String>   - The user who last modified the resource
        #               * state<~String>            - NIC state
        #             * properties<~Hash>         - A hash containing the nic properties
        #               * name<~String>             - The name of the NIC
        #               * mac<~String>              - The MAC address of the NIC
        #               * ips<~Array>               - IPs assigned to the NIC represented as a collection
        #               * dhcp<~Boolean>            - Boolean value that indicates if the NIC is using DHCP or not
        #               * lan<~integer>             - The LAN ID the NIC sits on
        #               * firewallActive<~Boolean>  - Once you add a firewall rule this will reflect a true value
        #             * entities<~Hash>           - A hash containing the nic entities
        #               * firewallrules<~hash>      - A list of firewall rules associated to the NIC represented as a collection
        #                 * id<~String>               - The resource's unique identifier
        #                 * type<~String>             - The type of the requested resource
        #                 * href<~String>             - URL to the object’s representation (absolute path)
        #                 * items<~Array>             - An array of individual firewall rules associated to the NIC
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#create-a-server]
        def create_server(datacenter_id, properties = {}, entities = {})
          server = {
            :properties => properties,
            :entities => entities
          }

          request(
            :expects  => [202],
            :method   => 'POST',
            :path     => "/datacenters/#{datacenter_id}/servers",
            :body     => Fog::JSON.encode(server)
          )
        end
      end

      class Mock
        def create_server(datacenter_id, properties = {}, entities = {})
          server_id = Fog::UUID.uuid

          volume_id = if entities[:volumes] && entities[:volumes]['items'] && entities[:volumes]['items'][0] && entities[:volumes]['items'][0]['id']
                        entities[:volumes]['items'][0]['id']
                      else
                        Fog::UUID.uuid
                      end

          server = {
            'id'    => server_id,
            'type'  => 'server',
            'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/servers/#{server_id}",
            'datacenter_id' => datacenter_id,
            'metadata' => {
              'createdDate'       => '2014-10-20T21:20:46Z',
              'createdBy'         => 'test@stackpointcloud.com',
              'etag'              => '0018832d7a7ba455db74ac41ae9f11fe',
              'lastModifiedDate'  => '2015-03-18T21:31:10Z',
              'lastModifiedBy'    => 'test@stackpointcloud.com',
              'state'             => 'AVAILABLE'
            },
            'properties' => {
              'name'              => properties[:name],
              'cores'             => properties[:cores],
              'ram'               => properties[:ram],
              'availabilityZone'  => properties[:availabilityZone],
              'vmState'           => 'RUNNING',
              'cpuFamily' => properties[:cpuFamily]
            }
          }

          if entities[:volumes]
            server['entities'] = {
              'volumes' => {
                'id'    => "#{server_id}/volumes",
                'type'  => 'collection',
                'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/servers/#{server_id}/volumes",
                'items' =>
                [
                  {
                    'id'          => volume_id,
                    'type'        => 'volume',
                    'href'        => "https=>//api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/volumes/#{volume_id}",
                    'metadata'    => {
                      'createdDate'       => '2015-03-18T19=>00=>51Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => 'c4a2fde6ba91a038ff953b939cc21efe',
                      'lastModifiedDate'  => '2015-03-18T19=>00=>51Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'                => 'FogRestTestVolume',
                      'type'                => 'HDD',
                      'size'                => 5,
                      'image'               => '4f363db0-4955-11e4-b362-52540066fee9',
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
                    }
                  }
                ]
              }
            }
          end

          if entities[:cdroms]
            server['entities']['cdroms'] = {
              'id'    => "#{server_id}/cdroms",
              'type'  => 'collection',
              'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/servers/#{server_id}/cdroms",
              'items' =>
              [
                {
                  'id'        => 'dfcb40db-28b5-11e6-9336-52540005ab80',
                  'type'      => 'image',
                  'href'      => 'https=>//api.profitbricks.com/rest/v2/images/dfcb40db-28b5-11e6-9336-52540005ab80',
                  'metadata'  => {
                    'createdDate'       => '2016-06-02T11:33:49Z',
                    'createdBy'         => 'System',
                    'etag'              => '9909709d99655c6f31aca789998d7d89',
                    'lastModifiedDate'  => '2016-06-02T11:33:49Z',
                    'lastModifiedBy'    => 'System',
                    'state'             => 'AVAILABLE'
                  },
                  'properties' => {
                    'name'                => 'CentOS-6.8-x86_64-netinstall.iso',
                    'description'         => '',
                    'location'            => 'us/las',
                    'size'                => 0.23,
                    'cpuHotPlug'          => 'true',
                    'cpuHotUnplug'        => 'false',
                    'ramHotPlug'          => 'true',
                    'ramHotUnplug'        => 'false',
                    'nicHotPlug'          => 'true',
                    'nicHotUnplug'        => 'true',
                    'discVirtioHotPlug'   => 'true',
                    'discVirtioHotUnplug' => 'true',
                    'discScsiHotPlug'     => 'false',
                    'discScsiHotUnplug'   => 'false',
                    'licenceType'         => 'LINUX',
                    'imageType'           => 'CDROM',
                    'public'              => 'true'
                  }
                }
              ]
            }
          end

          data[:servers]['items'] << server

          response = Excon::Response.new
          response.status = 202
          response.body = server

          response
        end
      end
    end
  end
end
