module Fog
  module Compute
    class ProfitBricks
      class Real
        # Get all locations
        #
        # ==== Parameters
        # * location_id<~String>  - UUID of the location
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier consisting of country/city
        #     * type<~String>                 - The type of the requested resource
        #     * href<~String>                 - URL to the object’s representation (absolute path)
        #     * properties<~Hash>             - A hash containing the location properties
        #       * name<~String>               - A descriptive name for the location
        #       * features<~Array>            - Features available at this location
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#get-location]
        def get_location(location_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/locations/#{location_id}?depth=5"
          )
        end
      end

      class Mock
        def get_location(location_id)
          if loc = data[:locations]['items'].find do |lo|
            lo["id"] == location_id
          end
          else
            raise Excon::Error::HTTPStatus, "The requested resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 200
          response.body   = loc
          response
        end
      end
    end
  end
end
