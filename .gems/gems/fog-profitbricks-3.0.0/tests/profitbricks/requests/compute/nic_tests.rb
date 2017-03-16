Shindo.tests('Fog::Compute[:profitbricks] | nic request', %w(profitbricks compute)) do
  @resource_schema = {
    'id'          => String,
    'type'        => String,
    'href'        => String,
    'metadata'    => Hash,
    'properties'  => Hash
  }

  @extended_resource_schema = {
    'id'          => String,
    'type'        => String,
    'href'        => String,
    'metadata'    => Hash,
    'properties'  => Hash,
    'entities'    => Hash
  }

  @minimal_schema_with_items = {
    'id' => String,
    'type'  => String,
    'href'  => String,
    'items' => Array
  }

  service = Fog::Compute[:profitbricks]

  tests('success') do
    Excon.defaults[:connection_timeout] = 200

    tests('#create_datacenter').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]        = 'FogTestDataCenter'
      options[:location]    = 'us/las'
      options[:description] = 'Part of server tests suite'

      createDatacenterResponse = service.create_datacenter(options)
      @datacenter_id = createDatacenterResponse.body['id']

      createDatacenterResponse.body
    end

    tests('#get_all_images').data_matches_schema(@minimal_schema_with_items) do
      getAllImagesResponse = service.get_all_images

      data = getAllImagesResponse.body['items'].find do |image|
        if ENV["FOG_MOCK"] != "true"
          if image['properties']
            image['properties']['location'] == 'us/las' &&
              image['properties']['imageType'] == 'CDROM' &&
              image['properties']['licenceType'] == 'LINUX'
          else
            image['location'] == 'us/las' &&
              image['imageType'] == 'CDROM' &&
              image['licenceType'] == 'LINUX'
          end
        else
          if image['properties']
            image['properties']['location'] == 'us/las' &&
              image['properties']['imageType'] == 'CDROM' &&
              image['properties']['licenceType'] == 'UNKNOWN'
          else
            image['location'] == 'us/las' &&
              image['imageType'] == 'CDROM' &&
              image['licenceType'] == 'UNKNOWN'
          end
        end
      end

      @image_id = data['id']
      getAllImagesResponse.body
    end

    tests('#create_server').data_matches_schema(@resource_schema) do
      properties = {}
      properties[:name]             = 'FogTestServer_3'
      properties[:cores]            = 1
      properties[:ram]              = 1024

      entities = {}
      entities[:volumes] = {}
      entities[:volumes]['items'] = [
        {
          'properties' => {
            'size' => 5,
            'name'        => 'FogTestVolume',
            'licenceType' => 'LINUX',
            'type'        => 'HDD'
          }
        }
      ]

      createServerResponse = service.create_server(@datacenter_id, properties, entities)
      @server_id = createServerResponse.body['id']

      sleep(60) if ENV["FOG_MOCK"] != "true"

      createServerResponse.body
    end

    tests('#get_all_lans').data_matches_schema(@minimal_schema_with_items) do
      getAllLansResponse = service.get_all_lans(@datacenter_id)
      getAllLansResponse.body
    end

    tests('#create_lan').data_matches_schema(@extended_resource_schema) do
      options = {}
      options[:name]    = 'FogTestLan_2'
      options[:public]  = 'true'

      createLanResponse = service.create_lan(@datacenter_id, options)
      @lan_id = createLanResponse.body['id']

      sleep(60) if ENV["FOG_MOCK"] != "true"

      createLanResponse.body
    end

    tests('#update_lan').data_matches_schema(@extended_resource_schema) do
      updateLanResponse = service.update_lan(@datacenter_id, @lan_id, 'name' => 'FogLan_2_Rename')
      updateLanResponse.body
    end

    tests('#get_lan').data_matches_schema(@extended_resource_schema) do
      service.get_lan(@datacenter_id, @lan_id).body
    end

    tests('#create_nic').data_matches_schema(@extended_resource_schema) do
      options = {}
      options[:name]  = 'FogTestNic_2'
      options[:lan]   = @lan_id
      options[:nat]   = false

      createNicResponse = service.create_nic(@datacenter_id, @server_id, options, {})
      @nic_id = createNicResponse.body['id']

      createNicResponse.body
    end

    tests('#get_nic').data_matches_schema(@extended_resource_schema) do
      sleep(60) if ENV["FOG_MOCK"] != "true"

      getNicResponse = service.get_nic(@datacenter_id, @server_id, @nic_id)
      getNicResponse.body
    end

    tests('#update_nic').data_matches_schema(@extended_resource_schema) do
      updateNicResponse = service.update_nic(@datacenter_id, @server_id, @nic_id, 'name' => 'FogTestNic_2_Rename')
      updateNicResponse.body
    end

    tests('#get_all_nic').data_matches_schema(@minimal_schema_with_items) do
      getAllNicResponse = service.get_all_nic(@datacenter_id, @server_id)
      getAllNicResponse.body
    end

    tests('#create_ip_block').data_matches_schema(@resource_schema) do
      options = {}
      options[:location]  = 'us/las'
      options[:size]      = 3
      options[:name]      = 'Fog test IP Block 1'

      createIpBlockResponse = service.create_ip_block(options)
      @ip_block_id = createIpBlockResponse.body['id']
      createIpBlockResponse.body
    end

    tests('#get_ip_block').data_matches_schema(@resource_schema) do
      service.get_ip_block(@ip_block_id).body
    end

    tests('#get_all_ip_blocks').data_matches_schema(@minimal_schema_with_items) do
      getAllIpBlocksResponse = service.get_all_ip_blocks
      getAllIpBlocksResponse.body
    end

    tests('#create_firewall_rule').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]            = 'Fog test Firewall Rule 3'
      options[:protocol]        = 'TCP'
      options[:portRangeStart]  = '80'
      options[:portRangeEnd]    = '80'

      createFirewallRuleResponse = service.create_firewall_rule(@datacenter_id, @server_id, @nic_id, options)
      @firewall_rule_id = createFirewallRuleResponse.body['id']
      createFirewallRuleResponse.body
    end

    tests('#get_firewall_rule').data_matches_schema(@resource_schema) do
      sleep(60) if ENV["FOG_MOCK"] != "true"
      service.get_firewall_rule(@datacenter_id, @server_id, @nic_id, @firewall_rule_id).body
    end

    tests('#update_firewall_rule').data_matches_schema(@resource_schema) do
      updateFirewallRuleResponse = service.update_firewall_rule(@datacenter_id, @server_id, @nic_id, @firewall_rule_id, 'name' => 'Fog test Firewall Rule 2 Rename')
      updateFirewallRuleResponse.body
    end

    tests('#get_all_firewall_rules').data_matches_schema(@minimal_schema_with_items) do
      getAllFirewallRulesResponse = service.get_all_firewall_rules(@datacenter_id, @server_id, @nic_id)
      getAllFirewallRulesResponse.body
    end

    tests('#create_load_balancer').data_matches_schema(@resource_schema) do
      options = {}
      options[:name] = 'FogTestLoadBalancer_2'

      createLoadBalancerResponse = service.create_load_balancer(@datacenter_id, options, {})
      @load_balancer_id = createLoadBalancerResponse.body['id']
      createLoadBalancerResponse.body
    end

    tests('#get_load_balancer').data_matches_schema(@resource_schema) do
      sleep(60) if ENV["FOG_MOCK"] != "true"

      service.get_load_balancer(@datacenter_id, @load_balancer_id).body
    end

    tests('#update_load_balancer').data_matches_schema(@resource_schema) do
      updateLoadBalancerResponse = service.update_load_balancer(@datacenter_id, @load_balancer_id, 'name' => 'FogTestLoadBalancer_2_Rename')
      updateLoadBalancerResponse.body
    end

    tests('#get_all_load_balancers').data_matches_schema(@minimal_schema_with_items) do
      getAllLoadBalancersResponse = service.get_all_load_balancers(@datacenter_id)
      getAllLoadBalancersResponse.body
    end

    tests('#associate_nic_to_load_balancer').succeeds do
      associateNicToLoadBalancerResponse = service.associate_nic_to_load_balancer(@datacenter_id, @load_balancer_id, @nic_id)
      associateNicToLoadBalancerResponse.status == 202
    end

    tests('#get_all_load_balancerd_nics').succeeds do
      getAllLoadBalancedNicsResponse = service.get_all_load_balanced_nics(@datacenter_id, @load_balancer_id)
      getAllLoadBalancedNicsResponse.status == 200
    end

    tests('#get_load_balanced_nic').succeeds do
      sleep(60) if ENV["FOG_MOCK"] != "true"
      getAllLoadBalancedNicsResponse = service.get_load_balanced_nic(@datacenter_id, @load_balancer_id, @nic_id)
      getAllLoadBalancedNicsResponse.status == 200
    end

    tests('#remove_nic_association').succeeds do
      removeNicAssociationResponse = service.remove_nic_association(@datacenter_id, @load_balancer_id, @nic_id)
      removeNicAssociationResponse.status == 202
    end

    tests('#delete_load_balancer').succeeds do
      deleteLoadBalancerResponse = service.delete_load_balancer(@datacenter_id, @load_balancer_id)
      deleteLoadBalancerResponse.status == 202
    end

    tests('#delete_firewall_rule').succeeds do
      deleteFirewallRuleResponse = service.delete_firewall_rule(@datacenter_id, @server_id, @nic_id, @firewall_rule_id)
      deleteFirewallRuleResponse.status == 202
    end

    tests('#delete_ip_block').succeeds do
      deleteIpBlockResponse = service.delete_ip_block(@ip_block_id)
      deleteIpBlockResponse.status == 202
    end

    tests('#delete_nic').succeeds do
      deleteNicResponse = service.delete_nic(@datacenter_id, @server_id, @nic_id)
      deleteNicResponse.status == 202
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
