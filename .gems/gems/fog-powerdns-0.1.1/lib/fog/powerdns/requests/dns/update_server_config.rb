module Fog
  module DNS
    class PowerDNS
      class Real
        # Update a specific config setting of one server
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

        def update_server_config(server, config, body)
          if config == 'allows_from'
            request(
                :body     => body,
                :expects  => 200,
                :method   => 'PUT',
                :path     => "/servers/#{server}/config/#{config}"
            ).body
          else
            puts 'Only allows_from config is allowed.'
          end
        end

      end
    end
  end
end