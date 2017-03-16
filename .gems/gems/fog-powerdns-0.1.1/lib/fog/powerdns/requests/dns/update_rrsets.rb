module Fog
  module DNS
    class PowerDNS
      class Real
        # Modify existing RRset's of a zone
        #
        # ==== Parameters
        # server<~String> - server id
        # zone<~String> - zone id
        # options<~Hash> - see pdns api for rules
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'rrsets'<~Hash> The representation of the rrsets:
        #       * 'name': <~String>,
        #       * 'type': <~String>,
        #       * 'changetype': <~String>,
        #       * 'records' <~Hash> domain records:
        #         * 'content': <~String>,
        #         * 'name': <~String>,
        #         * 'ttl': <~Integer>,
        #         * 'type': <~String>,
        #         * 'disabled': <~Boolean>,
        #         * 'set-ptr': <~Boolean>
        #       * 'comments' <~Hash> comments:
        #         * 'account': <~String>,
        #         * 'content': <~String>,
        #         * 'modfied_at': <~Integer>


        def update_rrsets(server, zone, options = {})
          options.each { |option, value|
            body[option] = value;
          }

          request(
              :body     => Fog::JSON.encode(body),
              :expects  => 200,
              :method   => 'PATCH',
              :path     => "/servers/#{server}/zones/#{zone}/"
          )
        end
      end
    end
  end
end