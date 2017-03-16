module Fog
  module Compute
    class Brightbox
      class Real
        # Lists summary details of firewall policies
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#firewall_policy_list_firewall_policies
        #
        def list_firewall_policies(options = {})
          wrapped_request("get", "/1.0/firewall_policies", [200], options)
        end
      end
    end
  end
end
