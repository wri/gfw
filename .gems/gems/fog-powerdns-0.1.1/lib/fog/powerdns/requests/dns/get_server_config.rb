module Fog
  module DNS
    class PowerDNS
      class Real
        # Get a specific config setting of one server
        # TODO: Can only get / retrieve recursor's allow_from
        #
        # ==== Parameters
        # * server<~String> - server id
        # * config<~String> - config name
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'type': <~String>,
        #     * 'name': <~String>,
        #     * 'value': <~String>
        #   * status<~String> - 200 when successful

        def get_server_config(server, config)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}/config/#{config}"
          ).body
        end

      end
    end
  end
end