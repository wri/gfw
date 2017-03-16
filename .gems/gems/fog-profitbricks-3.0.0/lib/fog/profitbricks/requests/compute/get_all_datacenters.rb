module Fog
  module Compute
    class ProfitBricks
      class Real
        # Get all virtual data centers
        #
        # ==== Parameters
        # * None
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #     * type<~String>                 - The type of the requested resource
        #     * href<~String>                 - URL to the object’s representation (absolute path)
        #     * items<~Array>
        #       * id<~String>                   - The resource's unique identifier
        #       * type<~String>                 - The type of the requested resource
        #       * href<~String>                 - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>               - A hash containing the resource's metadata
        #         * createdDate<~String>        - The date the resource was created
        #         * createdBy<~String>          - The user who created the resource
        #         * etag<~String>               - The etag for the resource
        #         * lastModifiedDate<~String>   - The last time the resource has been modified
        #         * lastModifiedBy<~String>     - The user who last modified the resource
        #         * state<~String>              - Data center state (AVAILABLE, BUSY, INACTIVE)
        #       * properties<~Hash>             - A hash containing the resource's properties
        #         * name<~String>               - The name of the data center
        #         * description<~String>        - The description of the data center
        #         * location<~String>           - The location where the data center was provisioned ("de/fkb", "de/fra", or "us/las")
        #         * version<~Integer>           - The version of the data center
        #         * features<~Array>            - The features of the data center
        #       * entities<~Hash>               - A hash containing the datacenter entities
        #         * servers<~Hash>              - A collection that represents the servers in a data center
        #         * volumes<~Hash>              - A collection that represents volumes in a data center
        #         * loadbalancers<~Hash>        - A collection that represents the loadbalancers in a data center
        #         * lans<~Hash>                 - A collection that represents the LANs in a data center
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-data-centers]
        def get_all_datacenters
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/datacenters?depth=5"
          )
        end
      end

      class Mock
        def get_all_datacenters
          response        = Excon::Response.new
          response.status = 200
          response.body   = data[:datacenters]
          response
        end
      end
    end
  end
end
