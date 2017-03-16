module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieves the attributes of a specific snapshot
        #
        # ==== Parameters
        # * snapshot_id<~String>  - Required, UUID of the snapshot
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #     * type<~String>                 - The type of the requested resource
        #     * href<~String>                 - URL to the object’s representation (absolute path)
        #     * metadata<~Hash>               - A hash containing the resource's metadata
        #       * createdDate<~String>        - The date the resource was created
        #       * createdBy<~String>          - The user who created the resource
        #       * etag<~String>               - The etag for the resource
        #       * lastModifiedDate<~String>   - The last time the resource has been modified
        #       * lastModifiedBy<~String>     - The user who last modified the resource
        #       * state<~String>              - Snapshot state (AVAILABLE, BUSY, INACTIVE)
        #     * properties<~Hash>             - A hash containing the resource's properties
        #       * name<~String>               - The name of the snapshot
        #       * description<~String>        - The description of the snapshot
        #       * location<~String>           - The snapshot's location ("de/fkb", "de/fra", or "us/las")
        #       * version<~Integer>           - The version of the data center
        #       * size<~Integer>              - The size of the snapshot in GB
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
        #       * licencetype<~String>        - The snapshot's licence type: LINUX, WINDOWS, or UNKNOWN.
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#get-snapshot]
        def get_snapshot(snapshot_id)
          request(
            :expects => [200],
            :method  => "GET",
            :path    => "/snapshots/#{snapshot_id}"
          )
        end
      end

      class Mock
        def get_snapshot(snapshot_id)
          if snapshot = data[:snapshots]['items'].find do |attrib|
            attrib["id"] == snapshot_id
          end
          else
            raise Excon::Error::HTTPStatus, "The requested resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 200
          response.body   = snapshot
          response
        end
      end
    end
  end
end
