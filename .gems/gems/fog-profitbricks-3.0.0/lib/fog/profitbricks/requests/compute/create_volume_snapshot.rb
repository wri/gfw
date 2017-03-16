module Fog
  module Compute
    class ProfitBricks
      class Real
        # Creates a snapshot of a volume within the data center.
        # A snapshot can be used to create a new storage volume or to restore a storage volume.
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required, UUID of virtual data center
        # * options<~Hash>:
        #   * name<~String>           - The name of the snapshot
        #   * description<~Integer>   - The description of the snapshot
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #     * type<~String>                 - The type of the requested resource
        #     * href<~String>                 - URL to the object’s representation (absolute path)
        #     * metadata<~Hash>               - Hash containing the snapshot metadata
        #       * createdDate<~String>        - The date the resource was created
        #       * createdBy<~String>          - The user who created the resource
        #       * etag<~String>               - The etag for the resource
        #       * lastModifiedDate<~String>   - The last time the resource has been modified
        #       * lastModifiedBy<~String>     - The user who last modified the resource
        #       * state<~String>              - Snapshot state
        #     * properties<~Hash>             - Hash containing the snapshot properties
        #       * name<~String>               - The name of the snapshot.
        #       * description<~String>        - The description of the snapshot
        #       * location<~String>           - The snapshot's location
        #       * size<~Integer>              - The size of the snapshot in GB
        #       * cpuHotPlug<~Boolean>        - This snapshot is capable of CPU hot plug (no reboot required)
        #       * cpuHotUnplug<~Boolean>      - This snapshot is capable of CPU hot unplug (no reboot required)
        #       * ramHotPlug<~Boolean>        - This snapshot is capable of memory hot plug (no reboot required)
        #       * ramHotUnplug<~Boolean>      - This snapshot is capable of memory hot unplug (no reboot required)
        #       * nicHotPlug<~Boolean>        - This snapshot is capable of nic hot plug (no reboot required)
        #       * nicHotUnplug<~Boolean>      - This snapshot is capable of nic hot unplug (no reboot required)
        #       * discVirtioHotPlug<~Boolean> - This snapshot is capable of Virt-IO drive hot plug (no reboot required)
        #       * discVirtioHotPlug<~Boolean> - This snapshot is capable of Virt-IO drive hot unplug (no reboot required)
        #       * discScsiHotPlug<~Boolean>   - This snapshot is capable of Scsi drive hot plug (no reboot required)
        #       * discScsiHotUnplug<~Boolean> - This snapshot is capable of Scsi drive hot unplug (no reboot required)
        #       * licenceType<~String>        - The snapshot's licence type: LINUX, WINDOWS, or UNKNOWN
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#create-volume-snapshot]
        def create_volume_snapshot(datacenter_id, volume_id, options = {})
          body = [["name", options[:name]]] if options[:name]

          request(
            :expects  => [202],
            :method   => 'POST',
            :path     => "/datacenters/#{datacenter_id}/volumes/#{volume_id}/create-snapshot",
            :headers => { "Content-Type" => "application/x-www-form-urlencoded" },
            :body => URI.encode_www_form(body)
          )
        end
      end

      class Mock
        def create_volume_snapshot(datacenter_id, _volume_id, options = {})
          response = Excon::Response.new
          response.status = 202

          if datacenter = data[:datacenters]['items'].find do |attrib|
            attrib['id'] == datacenter_id
          end
          else
            raise Excon::Error::HTTPStatus, 'Data center resource could not be found'
          end

          snapshot_id = Fog::UUID.uuid
          snapshot = {
            'id' => snapshot_id,
            'type'        => 'snapshot',
            'href'        => "https =>//api.profitbricks.com/rest/v2/snapshots/#{snapshot_id}",
            'metadata'    => {
              'createdDate' => '2016-08-07T22:28:39Z',
              'createdBy'         => 'test@stackpointcloud.com',
              'etag'              => '83ad78a4757ab0d9bdeaebc3a6485dcf',
              'lastModifiedDate'  => '2016-08-07T22:28:39Z',
              'lastModifiedBy'    => 'test@stackpointcloud.com',
              'state'             => 'AVAILABLE'
            },
            'properties' => {
              'name' => options[:name],
              'description'         => options[:description],
              'location'            => 'us/las',
              'size'                => 6,
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
              'licenceType'         => 'OTHER'
            }
          }

          data[:snapshots]['items'] << snapshot

          response.body = snapshot
          response
        end
      end
    end
  end
end
