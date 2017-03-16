module Fog
  module Compute
    class Brightbox
      class Real
        # Ends an existing 'accepted' collaboration
        #
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#user_collaboration_delete_user_collaboration
        #
        def delete_user_collaboration(identifier, options = {})
          return nil if identifier.nil? || identifier == ""
          wrapped_request("delete", "/1.0/user/collaborations/#{identifier}", [200], options)
        end

        # Old format of the delete request.
        #
        # @deprecated Use +#delete_user_collaboration+ instead
        #
        def destroy_user_collaboration(identifier)
          delete_user_collaboration(identifier)
        end
      end
    end
  end
end
