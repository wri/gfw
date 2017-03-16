module Fog
  module Compute
    class ProfitBricks
      class Real
        # Update an existing virtual data center
        #
        # ==== Parameters
        # * options<~Hash>:
        #     * name<~String>         - The new name of the data center
        #     * description<~String>  - The optional description of the data center
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
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#update-a-data-center]
        def update_datacenter(datacenter_id, options = {})
          request(
            :expects => [202],
            :method  => 'PATCH',
            :path    => "/datacenters/#{datacenter_id}",
            :body    => Fog::JSON.encode(options)
          )
        end
      end

      class Mock
        def update_datacenter(datacenter_id, options = {})
          if dc = data[:datacenters]["items"].find do |datacenter|
            datacenter["id"] == datacenter_id
          end
            options.each do |key, value|
              dc[key] = value
            end

            dc['properties']['version'] += 1 if dc['properties']
            dc['version'] += 1 if dc['version']

            dc['properties']['name'] += ' - updated' if dc['properties']
            dc['name'] += ' - updated' if dc['name']
            dc['properties']['description'] += ' - updated' if dc['properties']
            dc['description'] += ' - updated' if dc['description']

          else
            raise Excon::Error::HTTPStatus, "The requested resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 202
          response.body   = dc

          response
        end
      end
    end
  end
end
