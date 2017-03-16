module Fog
  module Compute
    class Brightbox
      class Real
        # Update some details of the API client.
        #
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [String] :name
        # @option options [String] :description
        # @option options [String] :permissions_group
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        # @return [NilClass] if no options were passed
        #
        # @see https://api.gb1.brightbox.com/1.0/#api_client_update_api_client
        #
        def update_api_client(identifier, options)
          return nil if identifier.nil? || identifier == ""
          return nil if options.empty? || options.nil?
          wrapped_request("put", "/1.0/api_clients/#{identifier}", [200], options)
        end
      end
    end
  end
end
