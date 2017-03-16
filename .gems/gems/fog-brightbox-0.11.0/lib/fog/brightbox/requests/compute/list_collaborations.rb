module Fog
  module Compute
    class Brightbox
      class Real
        # Lists all the collaborations for the given account
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#collaboration_list_collaborations
        #
        def list_collaborations(options = {})
          wrapped_request("get", "/1.0/collaborations", [200], options)
        end
      end
    end
  end
end
