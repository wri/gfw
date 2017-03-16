module Fog
  module DNS
    class PowerDNS
      class Real
        # Get details of all powerdns servers
        #
        # ==== Parameters
        #
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * server<~Array>:
        #       * 'type': <~String>,
        #       * 'id': <~String>,
        #       * 'url': <~String>,
        #       * 'daemon_type': <~String>,
        #       * 'version': <~String>,
        #       * 'config_url': <~String>,
        #       * 'zones_url': <~String>,
        #   * status<~String> - 200 when successful

        def list_servers
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers"
          ).body
        end

      end
    end
  end
end