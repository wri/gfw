module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieves the status of the request
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
        #       * status<~String>     - The status of the entire request, e.g. RUNNING
        #       * message<~String>    - The request message
        #       * etag<~String>       - The etag for the resource
        #       * targets<~Array>	    - The request status targets represented as a collection
        #         * target<~Hash>   - A hash containing individual target attributes
        #           * id<~String>     - The resource's unique identifier
        #           * type<~String>   - The type of the resource
        #           * href<~String>   - URL to the object’s representation (absolute path)
        #         * status<~String> - Status of individual items within the request, e.g. DONE
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#get-request-status]
        def get_request_status(request_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/requests/#{request_id}/status"
          )
        end
      end

      class Mock
        def get_request_status(_request_id)
          response        = Excon::Response.new
          response.status = 200
          response.body   = data[:request_status]

          response
          end
      end
    end
  end
end
