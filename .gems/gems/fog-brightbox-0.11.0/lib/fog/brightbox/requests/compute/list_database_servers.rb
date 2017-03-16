module Fog
  module Compute
    class Brightbox
      class Real
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#database_server_list_database_servers
        #
        def list_database_servers(options = {})
          wrapped_request("get", "/1.0/database_servers", [200], options)
        end
      end
    end
  end
end
