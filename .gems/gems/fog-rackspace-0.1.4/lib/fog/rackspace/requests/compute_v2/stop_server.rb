module Fog
  module Compute
    class RackspaceV2
      class Real
        # This operation stops a running server, and changes the server status to SHUTOFF
        # and changes the clean_shutdown parameter to TRUE.
        # Prior to running this command, the server status must be ACTIVE or ERROR.
        # @param [String] server_id id of server to rescue
        # @return [Excon::Response] response
        # @raise [Fog::Rackspace::Errors::NotFound] - HTTP 404
        # @raise [Fog::Rackspace::Errors::BadRequest] - HTTP 400
        # @raise [Fog::Rackspace::Errors::InternalServerError] - HTTP 500
        # @raise [Fog::Rackspace::Errors::ServiceError]
        # @note Rescue mode is only guaranteed to be active for 90 minutes
        # @see https://developer.rackspace.com/docs/cloud-servers/v2/api-reference/svr-basic-operations/#stop-specified-server

        def stop_server(server_id)
          data = {
            'os-stop' => nil
          }

          request(
            :body => Fog::JSON.encode(data),
            :expects => [202],
            :method => 'POST',
            :path => "servers/#{server_id}/action"
          )
        end
      end

      class Mock
        def stop_server(server_id)
          server = self.data[:servers][server_id]
          server["status"] = "SHUTOFF"
          response(:status => 202)
        end
      end
    end
  end
end
