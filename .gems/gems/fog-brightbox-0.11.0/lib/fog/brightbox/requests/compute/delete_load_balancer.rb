module Fog
  module Compute
    class Brightbox
      class Real
        # Destroy the LoadBalancer
        #
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#load_balancer_delete_load_balancer
        #
        def delete_load_balancer(identifier, options = {})
          return nil if identifier.nil? || identifier == ""
          wrapped_request("delete", "/1.0/load_balancers/#{identifier}", [202], options)
        end

        # Old format of the delete request.
        #
        # @deprecated Use +#delete_load_balancer+ instead
        #
        def destroy_load_balancer(identifier)
          delete_load_balancer(identifier)
        end
      end
    end
  end
end
