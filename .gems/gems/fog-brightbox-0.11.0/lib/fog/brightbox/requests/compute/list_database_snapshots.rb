module Fog
  module Compute
    class Brightbox
      class Real
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#database_snapshot_list_database_snapshots
        #
        def list_database_snapshots(options = {})
          wrapped_request("get", "/1.0/database_snapshots", [200], options)
        end
      end
    end
  end
end
