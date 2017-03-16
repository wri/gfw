module Fog
  module DNS
    class PowerDNS
      class Real
        # Retrieves server stats
        #
        # ==== Parameters
        # * server<~String> - server id
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Array>:
        #       * statistics<~Hash>:
        #         * 'type': <~String>,
        #         * 'name': <~String>,
        #         * 'value': <~String>
        #   * status<~Integer> - 200 when successful

        def get_server_stats(server)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}/statistics"
          ).body
        end

      end
    end
  end
end