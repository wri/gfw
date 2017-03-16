module Fog
  module DNS
    class PowerDNS
      class Real
        # Get all of a DNS server's config settings
        #
        # ==== Parameters
        # * server<~String> - server id
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Array>:
        #       * Config<~Hash>:
        #         * 'type': <~String>,
        #         * 'name': <~String>,
        #         * 'value': <~String>
        #   * status<~String> - 200 when successful

        def list_server_configs(server)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}/config"
          ).body
        end

      end
    end
  end
end