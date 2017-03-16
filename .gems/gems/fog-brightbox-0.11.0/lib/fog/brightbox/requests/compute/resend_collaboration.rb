module Fog
  module Compute
    class Brightbox
      class Real
        # Resends the invitation email to the collaborator
        #
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#collaboration_resend_collaboration
        #
        def resend_collaboration(identifier, options = {})
          return nil if identifier.nil? || identifier == ""
          wrapped_request("post", "/1.0/collaborations/#{identifier}/resend", [200], options)
        end
      end
    end
  end
end
