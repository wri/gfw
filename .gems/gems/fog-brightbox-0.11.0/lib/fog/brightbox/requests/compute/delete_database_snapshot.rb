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
        # @see https://api.gb1.brightbox.com/1.0/#database_snapshot_delete_database_snapshot
        #
        def delete_database_snapshot(identifier, options = {})
          return nil if identifier.nil? || identifier == ""
          wrapped_request("delete", "/1.0/database_snapshots/#{identifier}", [202], options)
        end

        # Old format of the delete request.
        #
        # @deprecated Use +#delete_database_snapshot+ instead
        #
        def destroy_database_snapshot(identifier)
          delete_database_snapshot(identifier)
        end
      end
    end
  end
end
