module Fog
  module DNS
    class PowerDNS
      class Real
        # Modify a single zone in PowerDNS
        #
        # ==== Parameters
        # server<~String> - server id
        # zone<~String> - zone id
        # options<~Hash> - pairs enumerated below
        #
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'id': <~String>,
        #     * "name": <~String>,
        #     * 'type': <~String>,
        #     * 'url': <~String>,
        #     * 'kind': <~String>,
        #     * 'serial': <~Integer>,
        #     * 'notified_serial': <~Int>,
        #     * 'masters': <~Array,
        #     * 'dnssec': <~Boolean>,
        #     * 'nsec3param': <~String>,
        #     * 'nsec3narrow': <~Boolean>,
        #     * 'presigned': <~Boolean>,
        #     * 'soa_edit': '<~String>',
        #     * 'soa_edit_api': '<~String>',
        #     * 'account': '<~String>',
        #     * 'nameservers': <~Array>,
        #     * 'servers': <~Array>,
        #     * 'recursion_desired': <~Boolean>,
        #     * 'records': <~Array>,
        #     * 'comments': <~Array>,
        #   * status<~Integer>  200 when successful

        def update_zone(server, zone, options = {})

          options.each { |option, value|
            body[option] = value;
          }

          request(
              :body     => Fog::JSON.encode(body),
              :expects  => 200,
              :method   => 'PUT',
              :path     => "/servers/#{server}/zones/#{zone}"
          ).body
        end
      end
    end
  end
end