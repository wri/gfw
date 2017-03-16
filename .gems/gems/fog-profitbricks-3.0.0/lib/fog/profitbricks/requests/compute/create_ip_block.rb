module Fog
  module Compute
    class ProfitBricks
      class Real
        # Creates a LAN within a data center
        #
        # ==== Parameters
        # * properties<~Hash>:
        #   * location<~String> - Required - This must be one of the locations: us/las, de/fra, de/fkb
        #   * size<~Integer>    - Required - The desired size of the IP block
        #   * name<~String>     - A descriptive name for the IP block
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
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#create-ip-block]
        def create_ip_block(options = {})
          ip_block = {
            :properties => options
          }

          request(
            :expects  => [202],
            :method   => 'POST',
            :path     => "/ipblocks",
            :body     => Fog::JSON.encode(ip_block)
          )
        end
      end

      class Mock
        def create_ip_block(options = {})
          ipb_3_id = Fog::UUID.uuid
          ip_block = {
            'id' => ipb_3_id,
            'type' => 'ipblock',
            'href' => "https://api.profitbricks.com/rest/v2/ipblocks/#{ipb_3_id}",
            'metadata' => {
              'createdDate' => '2016-07-31T15:41:27Z',
              'createdBy'         => 'test@stackpointcloud.com',
              'etag'              => '5b91832ee85a758568d4523a86bd8702',
              'lastModifiedDate'  => '2016-07-31T15:41:27Z',
              'lastModifiedBy'    => 'test@stackpointcloud.com',
              'state'             => 'AVAILABLE'
            },
            'properties' => {
              'ips' => ["777.777.777.777", "888.888.888.888", "999.999.999.999"],
              'location' => options[:location],
              'size'	    => options[:size],
              'name' => options[:name]
            }
          }

          data[:ip_blocks]['items'] << ip_block
          response        = Excon::Response.new
          response.status = 202
          response.body   = ip_block
          response
        end
      end
    end
  end
end
