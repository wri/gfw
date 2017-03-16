module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieve a list of IP Blocks
        #
        # ==== Parameters
        # * None
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		  - The resource's unique identifier
        #     * type<~String>		  - The type of the created resource
        #     * href<~String>		  - URL to the object’s representation (absolute path)
        #     * items<~Hash>      - Collection of individual IP Block objects
        #       * id<~String> 		  - The resource's unique identifier
        #       * type<~String>		  - The type of the created resource
        #       * href<~String>		  - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>	  - Hash containing the IP Block metadata
        #         * createdDate<~String>		  - The date the resource was created
        #         * createdBy<~String>		    - The user who created the resource
        #         * etag<~String>				      - The etag for the resource
        #         * lastModifiedDate<~String>	- The last time the resource has been modified
        #         * lastModifiedBy<~String>	  - The user who last modified the resource
        #         * state<~String>            - IP Block state
        #       * properties<~Hash> - Hash containing the IP Block properties
        #         * ips<~Array>               - A collection of IPs associated with the IP Block
        #         * location<~String>         - Location the IP block resides in
        #         * size<~Integer>            - Number of IP addresses in the block
        #         * name<~String>             - A descriptive name given to the IP block
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-ip-blocks]
        def get_all_ip_blocks
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/ipblocks?depth=5"
          )
        end
      end

      class Mock
        def get_all_ip_blocks
          ip_blocks = data[:ip_blocks]

          response        = Excon::Response.new
          response.status = 200
          response.body   = ip_blocks

          response
        end
      end
    end
  end
end
