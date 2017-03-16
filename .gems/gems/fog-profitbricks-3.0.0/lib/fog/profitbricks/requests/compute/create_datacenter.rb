module Fog
  module Compute
    class ProfitBricks
      class Real
        # Create a new virtual data center
        #
        # ==== Parameters
        # * options<~Hash>:
        #     * name<~String>         - The name of the data center
        #     * region<~String>       - The physical location where the data center will be created ("de/fkb", "de/fra", or "us/las")
        #     * description<~String>  - An optional description for the data center, e.g. staging, production.
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
        #       * state<~String>              - Data center state (AVAILABLE, BUSY, INACTIVE)
        #     * properties<~Hash>             - A hash containing the resource's properties
        #       * name<~String>               - The name of the data center
        #       * description<~String>        - The description of the data center
        #       * location<~String>           - The location where the data center was provisioned ("de/fkb", "de/fra", or "us/las")
        #       * version<~Integer>           - The version of the data center
        #       * features<~Array>            - The features of the data center
        #     * entities<~Hash>               - A hash containing the datacenter entities
        #       * servers<~Hash>              - A collection that represents the servers in a data center
        #       * volumes<~Hash>              - A collection that represents volumes in a data center
        #       * loadbalancers<~Hash>        - A collection that represents the loadbalancers in a data center
        #       * lans<~Hash>                 - A collection that represents the LANs in a data center
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#create-a-data-center]
        def create_datacenter(options)
          datacenter = {
            :properties => options
          }

          request(
            :expects  => [202],
            :method   => 'POST',
            :path     => '/datacenters',
            :body     => Fog::JSON.encode(datacenter)
          )
        end
      end

      class Mock
        def create_datacenter(_options)
          dc_3_id = Fog::UUID.uuid
          datacenter = {
            'id' => dc_3_id,
            'type' => 'datacenter',
            'href' => "https://api.profitbricks.com/rest/v2/datacenters/#{dc_3_id}",
            'metadata' => {
              'createdDate' => '2016-07-31T15:41:27Z',
              'createdBy' => 'test@stackpointcloud.com',
              'etag' => '5b91832ee85a758568d4523a86bd8702',
              'lastModifiedDate' => '2016-07-31T15:41:27Z',
              'lastModifiedBy' => 'test@stackpointcloud.com',
              'state' => 'AVAILABLE'
            },
            'properties' => {
              'name' => 'fog-demo',
              'description' => 'testing fog rest implementation',
              'location' => 'de/fra',
              'version' => 1,
              'features' => [

              ]
            }
          }

          data[:datacenters]['items'] << datacenter
          response        = Excon::Response.new
          response.status = 202
          response.body   = datacenter
          response
        end
      end
    end
  end
end
