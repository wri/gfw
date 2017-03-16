module Fog
  module Compute
    class ProfitBricks
      class Real
        # Update a load balancer
        #
        # ==== Parameters
        # * datacenter_id<~String>   - Required - UUID of the NIC
        # * load_balancer_id<~String> - Required - UUID of the load balancer
        # * options<~Hash>:
        #   * name<~String>   - The name of the Load Balancer
        #   * ip<~String>     - The IP of the Load Balancer
        #   * dhcp<~Boolean>  - Indicates if the loadbalancer will reserve an IP using DHCP
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
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#update-load-balancer]
        def update_load_balancer(datacenter_id, load_balancer_id, options = {})
          request(
            :expects => [202],
            :method  => 'PATCH',
            :path    => "/datacenters/#{datacenter_id}/loadbalancers/#{load_balancer_id}",
            :body    => Fog::JSON.encode(options)
          )
        end
      end

      class Mock
        def update_load_balancer(datacenter_id, load_balancer_id, options = {})
          if load_balancer = data[:load_balancers]['items'].find do |attribute|
            attribute["datacenter_id"] == datacenter_id && attribute["id"] == load_balancer_id
          end
            options.each do |key, value|
              load_balancer[key] = value
            end
          else
            raise Fog::Errors::NotFound, 'The requested resource could not be found'
          end

          response        = Excon::Response.new
          response.status = 202
          response.body   = load_balancer

          response
        end
      end
    end
  end
end
