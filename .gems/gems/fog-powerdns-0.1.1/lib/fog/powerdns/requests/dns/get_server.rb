module Fog
  module DNS
    class PowerDNS
      class Real
        # Get details of a DNS server
        #
        # ==== Parameters
        # * server<~String> - server id
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'type': <~String>,
        #     * 'id': <~String>,
        #     * 'url': <~String>,
        #     * 'daemon_type': <~String>,
        #     * 'version': <~String>,
        #     * 'config_url': <~String>,
        #     * 'zones_url': <~String>,
        #   * status<~String> - 200 when successful

        def get_server(server)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}"
          ).body
        end

      end
    end
  end
end