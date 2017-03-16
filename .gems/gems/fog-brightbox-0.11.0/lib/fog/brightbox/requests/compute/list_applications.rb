module Fog
  module Compute
    class Brightbox
      class Real
        # Lists summary details of applications available to the user
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#application_list_applications
        #
        def list_applications(options = {})
          wrapped_request("get", "/1.0/applications", [200], options)
        end
      end
    end
  end
end
