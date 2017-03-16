module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieves a list of requests
        #
        # ==== Parameters
        # * None
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		  - The resource's unique identifier
        #     * type<~String>		  - The type of the resource
        #     * href<~String>		  - URL to the object’s representation (absolute path)
        #     * items<~Hash>      - Collection of individual request objects
        #       * id<~String> 		  - The resource's unique identifier
        #       * type<~String>		  - The type of the resource
        #       * href<~String>		  - URL to the object’s representation (absolute path)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-requests]
        def get_all_requests
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/requests"
          )
        end
      end

      class Mock
        def get_all_requests
          requests = data[:requests]
          response        = Excon::Response.new
          response.status = 200
          response.body   = requests

          response
        end
      end
    end
  end
end
