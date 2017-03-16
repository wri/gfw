module Fog
  module DNS
    class PowerDNS
      class Real
        # Get details of all public cryptokeys
        #
        # ==== Parameters
        # server<~String> - server id
        # zone<~String> - zone id
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Array>:
        #       * Cryptokey<~Hash>:
        #       * 'type': <~String>,
        #       * 'id': <~Integer>,
        #       * 'active': <~Boolean>,
        #       * 'keytype': <~String>,
        #       * 'dnskey': <~String>,
        #       * 'content': <~String>,
        #       * 'ds': <~Array>
        #   * status<~Integer> - 200 when successful
        #

        def list_cryptokeys(server, zone)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}/zones/#{zone}/cryptokeys"
          ).body
        end

      end
    end
  end
end