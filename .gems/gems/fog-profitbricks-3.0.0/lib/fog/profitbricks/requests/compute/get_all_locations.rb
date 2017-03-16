module Fog
  module Compute
    class ProfitBricks
      class Real
        # Get all locations
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
        #       * id<~String>                   - The resource's unique identifier consisting of country/city
        #       * type<~String>                 - The type of the requested resource
        #       * href<~String>                 - URL to the object’s representation (absolute path)
        #       * properties<~Hash>             - A hash containing the location properties
        #         * name<~String>               - A descriptive name for the location
        #         * features<~Array>            - Features available at this location
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-locations]
        def get_all_locations
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/locations?depth=5"
          )
        end
      end

      class Mock
        def get_all_locations(_options = {})
          response        = Excon::Response.new
          response.status = 200
          response.body   = data[:locations]
          response
        end
      end
    end
  end
end
