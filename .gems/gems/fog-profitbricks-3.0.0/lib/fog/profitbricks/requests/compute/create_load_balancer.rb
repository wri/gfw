module Fog
  module Compute
    class ProfitBricks
      class Real
        # Creates a load balancer within the data center. Load balancers can be used for public or private IP traffic
        #
        # ==== Parameters
        # * datacenter_id<~String> - Required, UUID of the virtual data center
        # * properties<~Hash>:
        #   * name<~String>             - Required - The name of the load balancer
        #   * ip<~String>               - IPv4 address of the load balancer. All attached NICs will inherit this IP
        #   * dhcp<~Boolean>            - Indicates if the load balancer will reserve an IP using DHCP
        # * entities<~Hash>
        #   * balancednics<~Array>      - List of NICs taking part in load-balancing. All balanced nics inherit the IP of the loadbalancer.
        #                                 See the NIC section for attribute definitions
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		    - The resource's unique identifier
        #     * type<~String>		    - The type of the created resource
        #     * href<~String>		    - URL to the object’s representation (absolute path)
        #     * metadata<~Hash>	    - Hash containing the Load Balancer metadata
        #       * createdDate<~String>		  - The date the resource was created
        #       * createdBy<~String>		    - The user who created the resource
        #       * etag<~String>				      - The etag for the resource
        #       * lastModifiedDate<~String>	- The last time the resource has been modified
        #       * lastModifiedBy<~String>	  - The user who last modified the resource
        #       * state<~String>            - Load Balancer state
        #     * properties<~Hash>   - Hash containing the Load Balancer properties
        #       * name<~String>             - The name of the Load Balancer
        #       * ip<~String>               - Pv4 address of the Load Balancer. All attached NICs will inherit this IP
        #       * dhcp<~Boolean>            - Indicates if the Load Balancer will reserve an IP using DHCP
        #     * entities<~Integer>  - Hash containing the Load Balancer entities
        #       * balancednics<~Hash>   - List of NICs taking part in load-balancing. All balanced nics inherit the IP of the loadbalancer.
        #                                 See the NIC section for attribute definitions
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#create-load-balancer]
        def create_load_balancer(datacenter_id, properties = {}, entities = {})
          load_balancer = {
            :properties => properties,
            :entities => entities
          }

          request(
            :expects  => [202],
            :method   => 'POST',
            :path     => "/datacenters/#{datacenter_id}/loadbalancers",
            :body     => Fog::JSON.encode(load_balancer)
          )
        end
      end

      class Mock
        def create_load_balancer(datacenter_id, properties = {}, _entities = {})
          response = Excon::Response.new
          response.status = 202

          load_balancer_id  = Fog::UUID.uuid
          nic_1_id          = Fog::UUID.uuid
          serv_1_id         = Fog::UUID.uuid

          load_balancer = {
            'id' => load_balancer_id,
            'type'        => 'nic',
            'href'        => "https://api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/loadbalancers/#{load_balancer_id}",
            'metadata'    => {
              'createdDate' => '2015-03-18T19:00:51Z',
              'createdBy'         => 'test@stackpointcloud.com',
              'etag'              => 'faa67fbacb1c0e2e02cf9650657251f2',
              'lastModifiedDate'  => '2015-03-18T19:00:51Z',
              'lastModifiedBy'    => 'test@stackpointcloud.com',
              'state'             => 'AVAILABLE'
            },
            'properties'      => properties,
            'entities'        => {
              'balancednics' => {
                'id'    => "#{load_balancer_id}/balancednics",
                'type'  => 'collection',
                'href'  => "https=>//api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/loadbalancers/#{load_balancer_id}/balancednics",
                'items' =>
                [
                  {
                    'id'          => nic_1_id,
                    'type'        => 'nic',
                    'href'        => "https://api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/servers/#{serv_1_id}/nics/#{nic_1_id}",
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
                        'id'    => "#{nic_1_id}/firewallrules",
                        'type'  => 'collection',
                        'href'  => "https://api.profitbricks.com/rest/v2/datacenters/#{datacenter_id}/servers/#{serv_1_id}/nics/#{nic_1_id}/firewallrules",
                        'items' => []
                      }
                    },
                    'datacenter_id' => datacenter_id,
                    'load_balancer_id' => load_balancer_id
                  }
                ]
              }
            },
            'datacenter_id' => datacenter_id
          }

          data[:load_balancers]['items'] << load_balancer
          response.body = load_balancer

          response
        end
      end
    end
  end
end
