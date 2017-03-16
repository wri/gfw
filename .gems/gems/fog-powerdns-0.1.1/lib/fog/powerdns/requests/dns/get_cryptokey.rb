module Fog
  module DNS
    class PowerDNS
      class Real
        # Get details of a cryptokey
        #
        # ==== Parameters
        # * server<~String> - server id
        # * zone<~String> - zone id
        # * cryptokey<~String> - cryptokey id

        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'type': <~String>,
        #     * 'id': <~Integer>,
        #     * 'active': <~Boolean>,
        #     * 'keytype': <~String>,
        #     * 'dnskey': <~String>,
        #     * 'content': <~String>,
        #     * 'ds': <~Array>
        #   * status<~Integer> - 200 when successful
        #

        def get_cryptokey(server, zone, cryptokey)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}/zones/#{zone}/cryptokeys/#{cryptokey}"
          ).body
        end

      end
    end
  end
end