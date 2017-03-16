module Fog
  module Compute
    class Brightbox
      class Real
        # Resets the secret used by the application to a new generated value.
        #
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#application_reset_secret_application
        #
        def reset_secret_application(identifier, options = {})
          return nil if identifier.nil? || identifier == ""
          wrapped_request("post", "/1.0/applications/#{identifier}/reset_secret", [200], options)
        end
      end
    end
  end
end
