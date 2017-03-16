module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieves the attributes of a specific request
        #
        # ==== Parameters
        # * request_id<~String>   - The requests's unique identifier
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		  - The resource's unique identifier
        #     * type<~String>		  - The type of the resource
        #     * href<~String>		  - URL to the object’s representation (absolute path)
        #     * metadata<~Hash>   - A hash containing the resource's metadata
        #       * createdDate<~String>  - The date the resource was created
        #       * createdBy<~String>		- The user who created the resource
        #       * etag<~String>				  - The etag for the resource
        #       * requestStatus<~Hash>	- A hash containing the request status data
        #         * id<~String>     - The resource's unique identifier
        #         * type<~String>   - The type of the resource
        #         * href<~String>   - URL to the object’s representation (absolute path)
        #     * properties<~Hash> - A hash containing the resource's properties
        #       * method<~String>   - The HTTP method used
        #       * headers<~Hash>    - A hash containing the request headers
        #         * connection<~String>
        #         * host<~String>
        #         * x-forwarded-for<~String>
        #         * content-length<~String>
        #         * x-reseller<~String>
        #         * x-forwarded-host<~String>
        #         * user-agent<~String>
        #         * x-forwarded-server<~String>
        #       * body<~String>   - The body of the request
        #       * url<~String>    - The targeted URL of the request
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#get-request]
        def get_request(request_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/requests/#{request_id}"
          )
        end
      end

      class Mock
        def get_request(_request_id)
          response        = Excon::Response.new
          response.status = 200
          response.body   = data[:requests]['items'][0]

          response
          end
      end
    end
  end
end
