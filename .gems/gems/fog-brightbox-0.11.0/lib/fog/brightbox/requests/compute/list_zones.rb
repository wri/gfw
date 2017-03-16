module Fog
  module Compute
    class Brightbox
      class Real
        # Lists summary details of zones available to the account.
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#zone_list_zones
        #
        def list_zones(options = {})
          wrapped_request("get", "/1.0/zones", [200], options)
        end
      end
    end
  end
end
