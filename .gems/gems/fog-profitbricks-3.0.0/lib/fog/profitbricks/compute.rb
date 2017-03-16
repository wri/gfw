module Fog
  module Compute
    class ProfitBricks < Fog::Service
      API_VERSION = 'v3'.freeze

      autoload :Base, File.expand_path('../models/base', __FILE__)

      requires    :profitbricks_username, :profitbricks_password
      recognizes  :profitbricks_url

      # Models
      model_path 'fog/profitbricks/models/compute'
      model      :server
      collection :servers
      model      :datacenter
      collection :datacenters
      model      :region
      collection :regions
      model      :image
      collection :images
      model      :flavor
      collection :flavors
      model      :volume
      collection :volumes
      model      :lan
      collection :lans
      model      :nic
      collection :nics
      model      :location
      collection :locations
      model      :snapshot
      collection :snapshots
      model      :request
      collection :requests
      model      :ip_block
      collection :ip_blocks
      model      :firewall_rule
      collection :firewall_rules
      model      :load_balancer
      collection :load_balancers

      # Requests
      request_path 'fog/profitbricks/requests/compute'
      request    :create_server           	  	  # createServer
      request    :delete_server           	  	  # deleteServer
      request    :update_server           	  	  # updateServer
      request    :get_all_servers         	  	  # getAllServers
      request    :get_server              	  	  # getServer
      request    :list_attached_volumes   	  	  # listAttachedVolumes
      request    :attach_volume           	  	  # attachVolume
      request    :get_attached_volume     	  	  # getAttachedVolume
      request    :detach_volume           	  	  # detachVolume
      request    :list_attached_cdroms    	  	  # listAttachedCdroms
      request    :attach_cdrom            	  	  # attachCdrom
      request    :get_attached_cdrom      	  	  # getAttachedCdrom
      request    :detach_cdrom            	  	  # detachCdrom
      request    :reboot_server           	  	  # rebootServer
      request    :start_server            	  	  # startServer
      request    :stop_server             	  	  # stopServer

      request    :create_datacenter      	  	  # createDataCenter
      request    :delete_datacenter      	  	  # deleteDataCenter
      request    :update_datacenter      	  	  # updateDataCenter
      request    :get_all_datacenters    	  	  # getAllDataCenters
      request    :get_datacenter         	  	  # getDataCenter

      request    :get_all_locations       	  	  # getAllLocations
      request    :get_location            	  	  # getLocation

      request    :get_all_images          	  	  # getAllImages
      request    :get_image               	  	  # getImage
      request    :update_image            	  	  # updateImage
      request    :delete_image            	  	  # deleteImage

      request    :get_all_flavors         	  	  # getAllFlavors
      request    :get_flavor              	  	  # getFlavor
      request    :create_flavor           	  	  # createFlavor

      request    :create_volume           	  	  # createVolume
      request    :delete_volume           	  	  # deleteVolume
      request    :update_volume           	  	  # updateVolume
      request    :get_all_volumes         	  	  # getAllVolumes
      request    :get_volume              	  	  # getVolume
      request    :create_volume_snapshot  	  	  # createVolumeSnapshot
      request    :restore_volume_snapshot 	  	  # restoreVolumeSnapshot

      request    :get_all_lans            	  	  # getAllLans
      request    :get_lan                 	  	  # getLans
      request    :create_lan              	  	  # createLan
      request    :update_lan              	  	  # updateLan
      request    :delete_lan              	  	  # deleteLan

      request    :create_nic              	  	  # createNic
      request    :delete_nic              	  	  # deleteNic
      request    :update_nic              	  	  # updateNic
      request    :get_all_nic             	  	  # getAllNic
      request    :get_nic                 	  	  # getNic

      request    :delete_snapshot         	  	  # deleteSnapshot
      request    :update_snapshot         	  	  # updateSnapshot
      request    :get_all_snapshots       	  	  # getAllSnapshots
      request    :get_snapshot            	  	  # getSnapshot

      request    :get_all_requests        	  	  # getAllRequests
      request    :get_request             	  	  # getRequest
      request    :get_request_status          	  # getRequestStatus

      request    :get_all_ip_blocks           	  # getAllIpBlocks
      request    :get_ip_block                	  # getIpBlock
      request    :create_ip_block             	  # createIpBlock
      request    :delete_ip_block             	  # deleteIpBlock

      request    :get_all_firewall_rules      	  # getAllFireWallRules
      request    :get_firewall_rule           	  # getFirewallRule
      request    :create_firewall_rule        	  # createFirewallRule
      request    :update_firewall_rule        	  # updateFirewallRule
      request    :delete_firewall_rule        	  # deleteFirewallRule

      request    :get_all_load_balancers      	  # getAllLoadBalancers
      request    :get_load_balancer           	  # getLoadBalancer
      request    :create_load_balancer        	  # createLoadBalancer
      request    :delete_load_balancer        	  # deleteLoadBalancer
      request    :update_load_balancer        	  # deleteLoadBalancer
      request    :get_all_load_balanced_nics  	  # getAllLoadBalancedNics
      request    :get_load_balanced_nic       	  # getLoadBalancedNic
      request    :associate_nic_to_load_balancer  # associateNicToLoadBalancer
      request    :remove_nic_association          # associateNicToLoadBalancer

      class Real
        def initialize(options = {})
          @profitbricks_username = options[:profitbricks_username]
          @profitbricks_password = options[:profitbricks_password]
          @profitbricks_url      = options[:profitbricks_url] || "https://api.profitbricks.com"

          connection_options = options[:connection_options] || {}
          connection_options[:headers] ||= {}
          connection_options[:headers]["User-Agent"] = Fog::Core::Connection.user_agents.to_s
          connection_options[:omit_default_port] = true
          connection_options[:path_prefix] = "/cloudapi/#{API_VERSION}"

          @connection = Fog::Core::Connection.new(@profitbricks_url, false, connection_options)
        end

        def request(params)
          params[:headers] ||= {}
          params[:headers]["Authorization"] = "Basic #{auth_header}"
          params[:path_style] = false

          begin
            response = @connection.request(params)

          rescue Excon::Errors::Unauthorized => error
            Logger.warning('Unauthorized error')
            raise error, Fog::JSON.decode(error.response.body)['messages']
          rescue Excon::Errors::HTTPStatusError => error
            Logger.warning('HTTPStatusError error')
            raise error, Fog::JSON.decode(error.response.body)['messages']
          rescue Excon::Errors::InternalServerError => error
            Logger.warning('InternalServerError error')
            raise error, Fog::JSON.decode(error.response.body)['messages']
          rescue Fog::Errors::NotFound => error
            Logger.warning('NotFound error')
            raise error, Fog::JSON.decode(error.response.body)['messages']
          end

          if response && response.body && !response.body.empty?
            response.body = Fog::JSON.decode(response.body)
            response.body['requestId'] = get_request_id(response.headers)
          end
          response
        end

        private

        def auth_header
          Base64.strict_encode64(
            "#{@profitbricks_username}:#{@profitbricks_password}"
          )
        end

        def get_request_id(headers)
          location = headers['Location']
          location.match(/requests\/([-a-f0-9]+)/i)[1] unless location.nil?
        end
      end

      class Mock
        def self.data
          dc1_id   = Fog::UUID.uuid
          dc2_id   = Fog::UUID.uuid
          serv1_id = Fog::UUID.uuid
          vol1_id  = Fog::UUID.uuid
          vol2_id  = Fog::UUID.uuid
          req1_id  = Fog::UUID.uuid
          req2_id  = Fog::UUID.uuid
          nic1_id  = Fog::UUID.uuid
          nic2_id  = Fog::UUID.uuid
          ipb1_id  = Fog::UUID.uuid
          ipb2_id  = Fog::UUID.uuid
          fwr1_id  = Fog::UUID.uuid
          fwr2_id  = Fog::UUID.uuid
          lb1_id   = Fog::UUID.uuid
          lb2_id   = Fog::UUID.uuid

          @data ||= Hash.new do |hash, key|
            hash[key] = {
              :datacenters => {
                "id"    => "datacenters",
                "type"  => "collection",
                "href"  => "https://api.profitbricks.com/rest/v2/datacenters",
                "items" =>
                [
                  {
                    'id'        => dc1_id,
                    'type'      => 'datacenter',
                    'href'      => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}",
                    'metadata'  => {
                      'createdDate' => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8702',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name' => 'dc_1',
                      'description' => 'testing fog rest implementation',
                      'location'    => 'us/las',
                      'version'     => 1,
                      'features'    => %w(SSD MULTIPLE_CPU)
                    }
                  },
                  {
                    'id'        => dc2_id,
                    'type'      => 'datacenter',
                    'href'      => "https://api.profitbricks.com/rest/v2/datacenters/#{dc2_id}",
                    'metadata'  => {
                      'createdDate' => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8702',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name' => 'dc_2',
                      'description' => 'testing fog rest implementation',
                      'location'    => 'de/fkb',
                      'version'     => 1,
                      'features'    => %w(SSD MULTIPLE_CPU)
                    }
                  }
                ]
              },
              :servers => {
                'id'    => 'servers',
                'type'  => 'collection',
                "href"  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers",
                'items' =>
                [
                  {
                    'id'    => serv1_id,
                    'type'  => 'server',
                    'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}",
                    'metadata' => {
                      'createdDate'       => '2014-10-20T21:20:46Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '0018832d7a7ba455db74ac41ae9f11fe',
                      'lastModifiedDate'  => '2015-03-18T21:31:10Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'              => 'FogTestServer_1',
                      'cores'             => 1,
                      'ram'               => 1024,
                      'availabilityZone'  => 'AUTO',
                      'vmState'           => 'RUNNING',
                      'bootVolume'    => {
                        'id'          => 'c04a2198-7e60-4bc0-b869-6e9c9dbcb8e1',
                        'type'        => 'volume',
                        'href'        => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/c04a2198-7e60-4bc0-b869-6e9c9dbcb8e1",
                        'metadata'    => {
                          'createdDate'       => '2014-10-20T21:20:46Z',
                          'createdBy'         => 'test@stackpointcloud.com',
                          'etag'              => '7a539b539d8ca9e08c5ac5e63c9c4c8f',
                          'lastModifiedDate'  => '2014-10-20T21:20:46Z',
                          'lastModifiedBy'    => 'test@stackpointcloud.com',
                          'state'             => 'AVAILABLE'
                        },
                        'properties' => {
                          'name'                => 'Storage',
                          'type'                => 'HDD',
                          'size'                => 50,
                          'image'               => '4f363db0-4955-11e4-b362-52540066fee9',
                          'bus'                 => 'VIRTIO',
                          'licenceType'         => 'LINUX',
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
                          'deviceNumber'        => 1
                        }
                      },
                      'cpuFamily' => 'AMD_OPTERON'
                    },
                    'entities' => {
                      'cdroms'  => {
                        'id'    => "#{serv1_id}/cdroms",
                        'type'  => 'collection',
                        'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/cdroms",
                        'items' => []
                      },
                      'volumes' => {
                        'id'    => "#{serv1_id}/volumes",
                        'type'  => 'collection',
                        'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/volumes",
                        'items' =>
                        [
                          {
                            'id'          => 'c04a2198-7e60-4bc0-b869-6e9c9dbcb8e1',
                            'type'        => 'volume',
                            'href'        => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/c04a2198-7e60-4bc0-b869-6e9c9dbcb8e1",
                            'metadata'    => {
                              'createdDate'       => '2014-10-20T21:20:46Z',
                              'createdBy'         => 'test@stackpointcloud.com',
                              'etag'              => '7a539b539d8ca9e08c5ac5e63c9c4c8f',
                              'lastModifiedDate'  => '2014-10-20T21:20:46Z',
                              'lastModifiedBy'    => 'test@stackpointcloud.com',
                              'state'             => 'AVAILABLE'
                            },
                            'properties' => {
                              'name'                => 'Storage',
                              'type'                => 'HDD',
                              'size'                => 50,
                              'image'               => '4f363db0-4955-11e4-b362-52540066fee9',
                              'bus'                 => 'VIRTIO',
                              'licenceType'         => 'LINUX',
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
                              'deviceNumber'        => 1
                            }
                          },
                          {
                            'id'          => '5c4d37ca-d620-4546-8b24-f92e3c608c2c',
                            'type'        => 'volume',
                            'href'        => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/5c4d37ca-d620-4546-8b24-f92e3c608c2c",
                            'metadata'    => {
                              'createdDate'       => '2015-03-18T21:31:10Z',
                              'createdBy'         => 'test@stackpointcloud.com',
                              'etag'              => '0018832d7a7ba455db74ac41ae9f11fe',
                              'lastModifiedDate'  => '2015-03-18T21:31:10Z',
                              'lastModifiedBy'    => 'test@stackpointcloud.com',
                              'state'             => 'AVAILABLE'
                            },
                            'properties' => {
                              'name'                => 'Docker Registry Volume',
                              'type'                => 'HDD',
                              'size'                => 50,
                              'bus'                 => 'VIRTIO',
                              'licenceType'         => 'OTHER',
                              'cpuHotPlug'          => 'false',
                              'cpuHotUnplug'        => 'false',
                              'ramHotPlug'          => 'false',
                              'ramHotUnplug'        => 'false',
                              'nicHotPlug'          => 'false',
                              'nicHotUnplug'        => 'false',
                              'discVirtioHotPlug'   => 'false',
                              'discVirtioHotUnplug' => 'false',
                              'discScsiHotPlug'     => 'false',
                              'discScsiHotUnplug'   => 'false',
                              'deviceNumber'        => 2
                            }
                          }
                        ]
                      },
                      'nics'    => {
                        'id'    => "#{serv1_id}/nics",
                        'type'  => 'collection',
                        'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics",
                        'items' =>
                        [
                          {
                            'id'          => '01ea3bd9-047c-4941-85cf-ed6b7a2d1d7d',
                            'type'        => 'nic',
                            'href'        => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/01ea3bd9-047c-4941-85cf-ed6b7a2d1d7d",
                            'metadata'    => {
                              'createdDate'       => '2015-02-09T22:46:38Z',
                              'createdBy'         => 'test@stackpointcloud.com',
                              'etag'              => 'b4854a82738079d2c7f43b5324bd92e3',
                              'lastModifiedDate'  => '2015-02-09T22:46:38Z',
                              'lastModifiedBy'    => 'test@stackpointcloud.com',
                              'state'             => 'AVAILABLE'
                            },
                            'properties' => {
                              'mac'             => '00:02:94:9e:f4:b0',
                              'ips'             => ['210.94.35.77'],
                              'dhcp'            => 'true',
                              'lan'             => 1,
                              'firewallActive'  => 'false'
                            },
                            'entities' => {
                              'firewallrules' => {
                                'id'    => '01ea3bd9-047c-4941-85cf-ed6b7a2d1d7d/firewallrules',
                                'type'  => 'collection',
                                'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/664f0f1c-7384-462b-8f0c-cfc4c3f6e2a3/nics/01ea3bd9-047c-4941-85cf-ed6b7a2d1d7d/firewallrules",
                                'items' => []
                              }
                            }
                          }
                        ]
                      }
                    },
                    'datacenter_id' => dc1_id
                  }
                ]
              },
              :locations => {
                "id"    => "locations",
                "type"  => "collection",
                "href"  => "https://api.profitbricks.com/rest/v2/locations",
                "items" =>
                [
                  {
                    'id'          => 'de/fkb',
                    'type'        => 'location',
                    'href'        => 'https://api.profitbricks.com/rest/v2/locations/de/fkb',
                    'properties'  => {
                      'name'      => 'karlsruhe',
                      'features'  => %w(SSD MULTIPLE_CPU)
                    }
                  },
                  {
                    'id'          => 'de/fra',
                    'type'        => 'location',
                    'href'        => 'https://api.profitbricks.com/rest/v2/locations/de/fra',
                    'properties'  => {
                      'name'      => 'frankfurt',
                      'features'  => %w(SSD MULTIPLE_CPU)
                    }
                  },
                  {
                    'id'          => 'us/las',
                    'type'        => 'location',
                    'href'        => 'https://api.profitbricks.com/rest/v2/locations/us/las',
                    'properties'  => {
                      'name'      => 'lasvegas',
                      'features'  => %w(SSD MULTIPLE_CPU)
                    }
                  }
                ]
              },
              :images =>
              {
                "id"    => "images",
                "type"  => "collection",
                "href"  => "https://api.profitbricks.com/rest/v2/images",
                "items" =>
                [
                  {
                    'id'              => 'dfcb40db-28b5-11e6-9336-52540005ab80',
                    'type'            => 'image',
                    'href'            => 'https=>//api.profitbricks.com/rest/v2/images/dfcb40db-28b5-11e6-9336-52540005ab80',
                    'metadata'        => {
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
                  },
                  {
                    'id'              => '05cadf29-6c12-11e4-beeb-52540066fee9',
                    'type'            => 'image',
                    'href'            => 'https=>//api.profitbricks.com/rest/v2/images/05cadf29-6c12-11e4-beeb-52540066fee9',
                    'metadata'        => {
                      'createdDate'       => '2014-11-14T15:22:19Z',
                      'createdBy'         => 'System',
                      'etag'              => '957e0eac7456fa7554e73bf0d18860eb',
                      'lastModifiedDate'  => '2014-11-14T15=>22=>19Z',
                      'lastModifiedBy'    => 'System',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'                => 'Microsoft-SQL-2012-Full-trial-english.iso',
                      'description'         => '',
                      'location'            => 'us/las',
                      'size'                => 4,
                      'cpuHotPlug'          => 'false',
                      'cpuHotUnplug'        => 'false',
                      'ramHotPlug'          => 'false',
                      'ramHotUnplug'        => 'false',
                      'nicHotPlug'          => 'false',
                      'nicHotUnplug'        => 'false',
                      'discVirtioHotPlug'   => 'false',
                      'discVirtioHotUnplug' => 'false',
                      'discScsiHotPlug'     => 'false',
                      'discScsiHotUnplug'   => 'false',
                      'licenceType'         => 'OTHER',
                      'imageType'           => 'CDROM',
                      'public'              => 'true'
                    }
                  }
                ]
              },
              :flavors =>
              [
                {
                  'flavorId'   => Fog::UUID.uuid,
                  'flavorName' => 'Micro',
                  'ram'        => 1024,
                  'disk'       => 50,
                  'cores'      => 1
                },
                {
                  'flavorId'   => Fog::UUID.uuid,
                  'flavorName' => 'Small',
                  'ram'        => 2048,
                  'disk'       => 50,
                  'cores'      => 1
                }
              ],
              :volumes => {
                "id"    => "#{dc1_id}/volumes",
                "type"  => 'collection',
                "href"  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes",
                "items" =>
                [
                  {
                    'id'        => vol1_id,
                    'type'      => 'volume',
                    'href'      => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/#{vol1_id}",
                    'metadata'  => {
                      'createdDate'       => '2015-03-18T19:00:51Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => 'c4a2fde6ba91a038ff953b939cc21efe',
                      'lastModifiedDate'  => '2015-03-18T19=>00=>51Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'                => 'master 1 Storage',
                      'type'                => 'HDD',
                      'size'                => 50,
                      'image'               => '681673e7-bfc2-11e4-850c-52540066fee9',
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
                    'datacenter_id' => dc1_id
                  },
                  {
                    'id'        => vol2_id,
                    'type'      => 'volume',
                    'href'      => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/#{vol2_id}",
                    'metadata'  => {
                      'createdDate'       => '2015-03-18T21:31:10Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '0018832d7a7ba455db74ac41ae9f11fe',
                      'lastModifiedDate'  => '2015-03-18T21:31:10Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'                => 'Docker Registry Volume',
                      'type'                => 'HDD',
                      'size'                => 50,
                      'bus'                 => 'VIRTIO',
                      'licenceType'         => 'OTHER',
                      'cpuHotPlug'          => 'false',
                      'cpuHotUnplug'        => 'false',
                      'ramHotPlug'          => 'false',
                      'ramHotUnplug'        => 'false',
                      'nicHotPlug'          => 'false',
                      'nicHotUnplug'        => 'false',
                      'discVirtioHotPlug'   => 'false',
                      'discVirtioHotUnplug' => 'false',
                      'discScsiHotPlug'     => 'false',
                      'discScsiHotUnplug'   => 'false',
                      'deviceNumber'        => 2
                    },
                    'datacenter_id' => dc1_id
                  }
                ]
              },
              :lans => {
                'id'    => "#{dc1_id}/lans",
                'type'  => 'collection',
                'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/lans",
                'items' =>
                [
                  {
                    'id'          => '9',
                    'type'        => 'nic',
                    'href'        => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/lans/9",
                    'metadata'    => {
                      'createdDate'       => '2015-03-18T19:00:51Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => 'faa67fbacb1c0e2e02cf9650657251f1',
                      'lastModifiedDate'  => '2015-03-18T19:00:51Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'            => 'FogTestLAN_1',
                      'public'          => 'true'
                    },
                    'entities' => {
                      'nics' => {
                        'id'    => '9/nics',
                        'type'  => 'collection',
                        'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/lans/9/nics",
                        'items' => []
                      }
                    },
                    'datacenter_id' => dc1_id
                  }
                ]
              },
              :nics => {
                'id'    => "#{serv1_id}/nics",
                'type'  => 'collection',
                'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics",
                'items' =>
                [
                  {
                    'id'          => nic1_id,
                    'type'        => 'nic',
                    'href'        => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}",
                    'metadata'    => {
                      'createdDate'       => '2015-03-18T19:00:51Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => 'faa67fbacb1c0e2e02cf9650657251f1',
                      'lastModifiedDate'  => '2015-03-18T19:00:51Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'            => 'FogTestNIC_1',
                      'mac'             => '02:01:36:5f:09:da',
                      'ips'             => ['10.9.194.12'],
                      'dhcp'            => 'true',
                      'lan'             => 2,
                      'firewallActive'  => 'false'
                    },
                    'entities' => {
                      'firewallrules' => {
                        'id'    => "#{nic1_id}/firewallrules",
                        'type'  => 'collection',
                        'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}/firewallrules",
                        'items' => []
                      }
                    },
                    'datacenter_id' => dc1_id
                  },
                  {
                    'id'          => nic2_id,
                    'type'        => 'nic',
                    'href'        => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic2_id}",
                    'metadata'    => {
                      'createdDate'       => '2015-03-18T19:00:51Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => 'faa67fbacb1c0e2e02cf9650657251f1',
                      'lastModifiedDate'  => '2015-03-18T19:00:51Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'            => 'FogTestNIC_2',
                      'mac'             => '03:01:60:bf:d4:8a',
                      'ips'             => ['192.96.159.188'],
                      'dhcp'            => 'true',
                      'lan'             => 1,
                      'firewallActive'  => 'false'
                    },
                    'entities' => {
                      'firewallrules' => {
                        'id' => 'cf6d01d3-295d-48bd-8d07-568cce63cbbc/firewallrules',
                        'type' => 'collection',
                        'href' => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic2_id}/firewallrules",
                        'items' => []
                      }
                    },
                    'datacenter_id' => dc1_id
                  }
                ]
              },
              :snapshots => {
                'id'    => 'snapshots',
                'type'  => 'collection',
                'href'  => 'https =>//api.profitbricks.com/rest/v2/snapshots',
                'items' =>
                [
                  {
                    'id'          => '3d52b13d-bec4-49de-ad05-fd2f8c687be6',
                    'type'        => 'snapshot',
                    'href'        => 'https =>//api.profitbricks.com/rest/v2/snapshots/3d52b13d-bec4-49de-ad05-fd2f8c687be6',
                    'metadata'    => {
                      'createdDate'       => '2016-08-07T22:28:38Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '83ad78a4757ab0d9bdeaebc3a6485dcf',
                      'lastModifiedDate'  => '2016-08-07T22:28:38Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'                => 'FogTestSnapshot',
                      'description'         => 'Testing fog create volume snapshot',
                      'location'            => 'de/fkb',
                      'size'                => 5,
                      'cpuHotPlug'          => 'false',
                      'cpuHotUnplug'        => 'false',
                      'ramHotPlug'          => 'false',
                      'ramHotUnplug'        => 'false',
                      'nicHotPlug'          => 'false',
                      'nicHotUnplug'        => 'false',
                      'discVirtioHotPlug'   => 'false',
                      'discVirtioHotUnplug' => 'false',
                      'discScsiHotPlug'     => 'false',
                      'discScsiHotUnplug'   => 'false',
                      'licenceType'         => 'LINUX'
                    }
                  }
                ]
              },
              :requests => {
                'id'    => 'requests',
                'type'  => 'collection',
                'href'  => 'https=>//api.profitbricks.com/rest/v2/requests',
                'items' =>
                [
                  {
                    'id'        => req1_id,
                    'type'      => 'request',
                    'href'      => "https=>//api.profitbricks.com/rest/v2/requests/#{req1_id}",
                    'metadata'  => {
                      'createdDate'   => '2016-08-07T23:32:17Z',
                      'createdBy'     => 'test@stackpointcloud.com',
                      'etag'          => '37a6259cc0c1dae299a7866489dff0bd',
                      'requestStatus' => {
                        'id'    => "#{req1_id}/status",
                        'type'  => 'request-status',
                        'href'  => "https://api.profitbricks.com/rest/v2/requests/#{req1_id}/status"
                      }
                    },
                    'properties' => {
                      'method'  => 'POST',
                      'headers' => {
                        'content-type'        => 'application/x-www-form-urlencoded',
                        'connection'          => 'Keep-Alive',
                        'host'                => 'api.profitbricks.com',
                        'x-forwarded-for'     => '100.00.00.01',
                        'content-length'      => '47',
                        'x-forwarded-host'    => 'api.profitbricks.com',
                        'x-reseller'          => 'pb.domain',
                        'user-agent'          => 'fog-core/1.42.0',
                        'x-forwarded-server'  => 'my.profitbricks.com'
                      },
                      'body' => '{\'snapshotId\': \'3d52b13d-bec4-49de-ad05-fd2f8c687be6\'}',
                      'url' => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/#{vol1_id}/restore-snapshot"
                    }
                  },
                  {
                    'id'        => req2_id,
                    'type'      => 'request',
                    'href'      => "https=>//api.profitbricks.com/rest/v2/requests/#{req2_id}",
                    'metadata'  => {
                      'createdDate'   => '2016-08-07T23:32:17Z',
                      'createdBy'     => 'test@stackpointcloud.com',
                      'etag'          => '37a6259cc0c1dae299a7866489dff0bd',
                      'requestStatus' => {
                        'id'    => "#{req2_id}/status",
                        'type'  => 'request-status',
                        'href'  => "https://api.profitbricks.com/rest/v2/requests/#{req2_id}/status"
                      }
                    },
                    'properties' => {
                      'method'  => 'POST',
                      'headers' => {
                        'content-type'        => 'application/x-www-form-urlencoded',
                        'connection'          => 'Keep-Alive',
                        'host'                => 'api.profitbricks.com',
                        'x-forwarded-for'     => '100.00.00.01',
                        'content-length'      => '47',
                        'x-forwarded-host'    => 'api.profitbricks.com',
                        'x-reseller'          => 'pb.domain',
                        'user-agent'          => 'fog-core/1.42.0',
                        'x-forwarded-server'  => 'my.profitbricks.com'
                      },
                      'body' => '{\'snapshotId\': \'3d52b13d-bec4-49de-ad05-fd2f8c687be6\'}',
                      'url' => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/volumes/#{vol2_id}/restore-snapshot"
                    }
                  }
                ]
              },
              :request_status => {
                'id' => "#{req1_id}/status",
                'type' => 'request-status',
                'href' => "https=>//api.profitbricks.com/rest/v2/requests/#{req1_id}/status",
                'metadata' => {
                  'status' => 'DONE',
                  'message' => 'Request has been successfully executed',
                  'etag' => '2ba22e58ca17bb728d522bba36cf8350',
                  'targets' =>
                  [
                    {
                      'target' => {
                        'id' => '752df03a-b9a6-48ee-b9f5-58433184aa1a',
                        'type' => 'volume',
                        'href' => 'TO_BE_INJECTED'
                      },
                      'status' => 'DONE'
                    }
                  ]
                }
              },
              :ip_blocks => {
                'id' => 'ipblocks',
                'type' => 'collection',
                'href' => 'https://api.profitbricks.com/rest/v2/ipblocks',
                'items' =>
                [
                  {
                    'id' => ipb1_id,
                    'type' => 'ipblock',
                    'href' => "https://api.profitbricks.com/rest/v2/ipblocks/#{ipb1_id}",
                    'metadata' => {
                      'createdDate'       => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8702',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'ips'    	  => ["111.111.111.111", "222.222.222.222"],
                      'location'  => 'us/las',
                      'size'	    => 2,
                      'name' => 'Fog test IP Block 1'
                    }
                  },
                  {
                    'id' => ipb2_id,
                    'type' => 'ipblock',
                    'href' => "https://api.profitbricks.com/rest/v2/ipblocks/#{ipb2_id}",
                    'metadata' => {
                      'createdDate'       => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8702',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'ips'    	  => ["333.333.333.333"],
                      'location'  => 'us/las',
                      'size'	    => 1,
                      'name' => 'Fog test IP Block 2'
                    }
                  }
                ]
              },
              :firewall_rules => {
                'id'    => "#{nic1_id}/firewallrules",
                'type'  => 'collection',
                'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}/firewallrules",
                'items' =>
                [
                  {
                    'id'    => fwr1_id,
                    'type'  => 'firewall-rule',
                    'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}/firewallrules/#{fwr1_id}",
                    'metadata' => {
                      'createdDate'       => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8703',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'            => 'Fog test Firewall Rule 1',
                      'protocol'        => 'TCP',
                      'sourceMac'       => 'null',
                      'sourceIp'        => 'null',
                      'targetIp'        => 'null',
                      'icmpCode'        => 'null',
                      'icmpType'        => 'null',
                      'portRangeStart'  => 22,
                      'portRangeEnd'    => 22
                    },
                    'datacenter_id' => dc1_id,
                    'server_id'       => serv1_id,
                    'nic_id'          => nic1_id
                  },
                  {
                    'id'    => fwr2_id,
                    'type'  => 'firewall-rule',
                    'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}/firewallrules/#{fwr2_id}",
                    'metadata' => {
                      'createdDate'       => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8701',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'            => 'Fog test Firewall Rule 2',
                      'protocol'        => 'TCP',
                      'sourceMac'       => 'null',
                      'sourceIp'        => 'null',
                      'targetIp'        => 'null',
                      'icmpCode'        => 'null',
                      'icmpType'        => 'null',
                      'portRangeStart'  => 24,
                      'portRangeEnd'    => 25
                    },
                    'datacenter_id' => dc1_id,
                    'server_id'       => serv1_id,
                    'nic_id'          => nic1_id
                  }
                ]
              },
              :load_balancers => {
                'id'    => "#{dc1_id}/loadbalancers",
                'type'  => 'collection',
                'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/loadbalancers",
                'items' =>
                [
                  {
                    'id'    => lb1_id,
                    'type'  => 'loadbalancer',
                    'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/loadbalancers/#{lb1_id}",
                    'metadata' => {
                      'createdDate'       => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8723',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'AVAILABLE'
                    },
                    'properties' => {
                      'name'  => 'Fog test Load Balancer 1',
                      'ip'    => 'null',
                      'dhcp'  => 'true'
                    },
                    'entities' => {
                      'balancednics' => {
                        'id'    => "#{lb1_id}/balancednics",
                        'type'  => 'collection',
                        'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/loadbalancers/#{lb1_id}/balancednics",
                        'items' =>
                        [
                          {
                            'id'          => nic1_id,
                            'type'        => 'nic',
                            'href'        => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}",
                            'metadata'    => {
                              'createdDate'       => '2015-03-18T19:00:51Z',
                              'createdBy'         => 'test@stackpointcloud.com',
                              'etag'              => 'faa67fbacb1c0e2e02cf9650657251f1',
                              'lastModifiedDate'  => '2015-03-18T19:00:51Z',
                              'lastModifiedBy'    => 'test@stackpointcloud.com',
                              'state'             => 'AVAILABLE'
                            },
                            'properties' => {
                              'name'            => 'FogTestLoadBalancedNIC_1',
                              'mac'             => '02:01:36:5f:09:da',
                              'ips'             => ['10.9.194.12'],
                              'dhcp'            => 'true',
                              'lan'             => 2,
                              'firewallActive'  => 'false'
                            },
                            'entities' => {
                              'firewallrules' => {
                                'id'    => "#{nic1_id}/firewallrules",
                                'type'  => 'collection',
                                'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/servers/#{serv1_id}/nics/#{nic1_id}/firewallrules",
                                'items' => []
                              }
                            },
                            'datacenter_id' => dc1_id,
                            'load_balancer_id' => lb1_id
                          }
                        ]
                      }
                    },
                    'datacenter_id' => dc1_id
                  },
                  {
                    'id'    => lb2_id,
                    'type'  => 'loadbalancer',
                    'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/loadbalancers/#{lb2_id}",
                    'metadata' => {
                      'createdDate'       => '2016-07-31T15:41:27Z',
                      'createdBy'         => 'test@stackpointcloud.com',
                      'etag'              => '5b91832ee85a758568d4523a86bd8721',
                      'lastModifiedDate'  => '2016-07-31T15:41:27Z',
                      'lastModifiedBy'    => 'test@stackpointcloud.com',
                      'state'             => 'INACTIVE'
                    },
                    'properties' => {
                      'name'  => 'Fog test Load Balancer 2',
                      'ip'    => 'null',
                      'dhcp'  => 'false'
                    },
                    'entities' => {
                      'balancednics' => {
                        'id' => "#{lb2_id}/balancednics",
                        'type'  => 'collection',
                        'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{dc1_id}/loadbalancers/#{lb2_id}/balancednics",
                        'items' => []
                      }
                    },
                    'datacenter_id' => dc1_id
                  }
                ]
              }
            }
          end
        end

        def self.reset
          @data = nil
        end

        def initialize(options = {})
          @profitbricks_username = options[:profitbricks_username]
          @profitbricks_password = options[:profitbricks_password]
        end

        def data
          self.class.data[@profitbricks_username]
        end

        def reset_data
          self.class.data.delete(@profitbricks_username)
        end
      end
    end
  end
end
