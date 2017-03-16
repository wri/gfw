Shindo.tests('Fog::Compute[:profitbricks] | composite create server request', %w(profitbricks compute)) do
  @resource_schema = {
    'id' => String,
    'type'                => String,
    'href'                => String,
    'metadata'            => Hash,
    'properties'          => Hash
  }

  @minimal_schema_with_items = {
    'id' => String,
    'type'  => String,
    'href'  => String,
    'items' => Array
  }

  service = Fog::Compute[:profitbricks]

  tests('success') do
    Excon.defaults[:connection_timeout] = 500

    tests('#create_datacenter').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]        = 'FogTestDataCenter2'
      options[:location]    = 'us/las'
      options[:description] = 'Part of server tests suite'

      createDatacenterResponse = service.create_datacenter(options)
      @datacenter_id = createDatacenterResponse.body['id']

      sleep(60) if ENV["FOG_MOCK"] != "true"

      createDatacenterResponse.body
    end

    tests('#get_datacenter').data_matches_schema(@resource_schema) do
      getDatacenterResponse = service.get_datacenter(@datacenter_id)
      getDatacenterResponse.body
    end

    tests('#get_all_datacenters').data_matches_schema(@minimal_schema_with_items) do
      getAllDatacentersResponse = service.get_all_datacenters
      getAllDatacentersResponse.body
    end

    tests('#update_datacenter').data_matches_schema(@resource_schema) do
      options = {}
      options[:name] = 'FogTestDataCenter2Rename'
      options[:description] = 'FogDataCenterDescriptionUpdated'

      updateDatacenterResponse = service.update_datacenter(
        @datacenter_id, options
      )

      updateDatacenterResponse.body
    end

    tests('#create_lan').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]    = 'FogTestLan_3'
      options[:public]  = 'true'

      createLanResponse = service.create_lan(@datacenter_id, options)
      @lan_id = createLanResponse.body['id']

      sleep(60) if ENV["FOG_MOCK"] != "true"

      createLanResponse.body
    end

    tests('#create_server').data_matches_schema(@resource_schema) do
      nic = {}
      nic[:name]  = 'FogTestNic_2'
      nic[:lan]   = @lan_id

      properties = {}
      properties[:name]             = 'FogTestServer_2'
      properties[:cores]            = 1
      properties[:ram]              = 1024
      properties[:availabilityZone] = 'ZONE_1'
      properties[:cpuFamily]        = 'INTEL_XEON'

      entities = {}
      entities[:volumes] = {}
      entities[:volumes]['items'] = [
        {
          :properties => {
            :name         => 'FogRestTestVolume',
            :size         => 5,
            :licenceType  => 'LINUX',
            :type         => 'HDD'
          }
        }
      ]

      entities[:nics] = {}
      entities[:nics]['items'] = [
        {
          :properties => {
            :name => 'FogTestNic_2',
            :lan  => @lan_id
          },

          :entities => {
            :firewallrules => {
              :items => [
                {
                  :properties => {
                    :name           => 'Fog test Firewall Rule 3',
                    :protocol       => 'TCP',
                    :portRangeStart => '80',
                    :portRangeEnd   => '80'
                  }
                }
              ]
            }
          }
        }
      ]

      createServerResponse = service.create_server(@datacenter_id, properties, entities)
      @server_id = createServerResponse.body['id']

      sleep(60) if ENV["FOG_MOCK"] != "true"

      createServerResponse.body
    end

    tests('#get_server').data_matches_schema(@resource_schema) do
      getServerResponse = service.get_server(@datacenter_id, @server_id)
      getServerResponse.body
    end

    tests('#update_server').data_matches_schema(@resource_schema) do
      updateServerResponse = service.update_server(@datacenter_id, @server_id, 'name' => 'FogTestServer_2_Rename')

      updateServerResponse.body
    end

    tests('#get_all_servers').data_matches_schema(@minimal_schema_with_items) do
      getAllServersResponse = service.get_all_servers(@datacenter_id)

      getAllServersResponse.body
    end

    tests('#stop_server').succeeds do
      stopServerResponse = service.stop_server(@datacenter_id, @server_id)

      stopServerResponse.status == 202
    end

    tests('#start_server').succeeds do
      startServerResponse = service.start_server(@datacenter_id, @server_id)

      startServerResponse.status == 202
    end

    tests('#reboot_server').succeeds do
      rebootServerResponse = service.reboot_server(@datacenter_id, @server_id)

      rebootServerResponse.status == 202
    end

    tests('#delete_server').succeeds do
      deleteServerResponse = service.delete_server(@datacenter_id, @server_id)
      deleteServerResponse.status == 202
    end

    tests('#delete_datacenter').succeeds do
      deleteDatacenterResponse = service.delete_datacenter(@datacenter_id)
      deleteDatacenterResponse.status == 202
    end
  end
end
