module Fog
  module Compute
    class Brightbox
      class Real
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#load_balancer_unlock_resource_load_balancer
        #
        def unlock_resource_load_balancer(identifier, options = {})
          return nil if identifier.nil? || identifier == ""
          wrapped_request("put", "/1.0/load_balancers/#{identifier}/unlock_resource", [200], options)
        end
      end
    end
  end
end
