module Fog
  module Compute
    class Brightbox
      class Real
        # Lists summary details of API clients owned by the account.
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#api_client_list_api_clients
        #
        def list_api_clients(options = {})
          wrapped_request("get", "/1.0/api_clients", [200], options)
        end
      end
    end
  end
end
