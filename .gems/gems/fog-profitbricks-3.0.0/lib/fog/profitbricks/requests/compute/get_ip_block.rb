module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieves the attributes of a specific IP Block
        #
        # ==== Parameters
        # * ip_block_id<~String> - UUID of the IP Block
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		  - The resource's unique identifier
        #     * type<~String>		  - The type of the created resource
        #     * href<~String>		  - URL to the object’s representation (absolute path)
        #     * metadata<~Hash>	  - Hash containing the IP Block metadata
        #       * createdDate<~String>		  - The date the resource was created
        #       * createdBy<~String>		    - The user who created the resource
        #       * etag<~String>				      - The etag for the resource
        #       * lastModifiedDate<~String>	- The last time the resource has been modified
        #       * lastModifiedBy<~String>	  - The user who last modified the resource
        #       * state<~String>            - IP Block state
        #     * properties<~Hash> - Hash containing the IP Block properties
        #       * ips<~Array>               - A collection of IPs associated with the IP Block
        #       * location<~String>         - Location the IP block resides in
        #       * size<~Integer>            - Number of IP addresses in the block
        #       * name<~String>             - A descriptive name given to the IP block
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#get-ip-block]
        def get_ip_block(ip_block_id)
          request(
            :expects => [200],
            :method  => "GET",
            :path    => "/ipblocks/#{ip_block_id}?depth=5"
          )
        end
      end

      class Mock
        def get_ip_block(ip_block_id)
          if ip_block = data[:ip_blocks]['items'].find do |ipb|
            ipb["id"] == ip_block_id
          end
          else
            raise Fog::Errors::NotFound, "The requested IP Block could not be found"
          end

          response        = Excon::Response.new
          response.status = 200
          response.body   = ip_block
          response
        end
      end
    end
  end
end
