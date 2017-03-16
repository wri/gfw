module Fog
  module Compute
    class Brightbox
      class Real
        # Lists summary details of load balancers owned by the account.
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#load_balancer_list_load_balancers
        #
        def list_load_balancers(options = {})
          wrapped_request("get", "/1.0/load_balancers", [200], options)
        end
      end
    end
  end
end
