module Fog
  module Compute
    class Brightbox
      class Real
        # @param [String] identifier Unique reference to identify the resource
        # @param [Hash] options
        # @option options [Boolean] :return_link Return the Link header as a second return value
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#database_server_snapshot_database_server
        #
        def snapshot_database_server(identifier, options = {})
          return nil if identifier.nil? || identifier == ""

          method = "POST"
          path = "/1.0/database_servers/#{identifier}/snapshot"
          expected = [202]

          if options[:return_link]
            request_parameters = {
              :method => method, :path => path, :expects => expected
            }
            response = request(request_parameters)
            data = Fog::JSON.decode(response.body)
            image_id = Fog::Brightbox::LinkHelper.new(response.headers["Link"]).identifier
            return data, image_id
          else
            wrapped_request(method, path, expected)
          end
        end
      end
    end
  end
end
