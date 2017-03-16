module Fog
  module DNS
    class PowerDNS
      class Real
        # DNS Notify all slaves of the zone
        # Authoritative only, zone must be set up as master
        # or slave (fails otherwise)
        #
        # ==== Parameters
        # * server<~String> - server id
        # * zone<~String> - zone name
        #
        # ==== Returns
        # TODO: Untested
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

        def notify_zone(server, zone)
          request(
              :expects  => 200,
              :method   => 'PUT',
              :path     => "/servers/#{server}/zones/#{zone}/notify"
          )
        end

      end
    end
  end
end