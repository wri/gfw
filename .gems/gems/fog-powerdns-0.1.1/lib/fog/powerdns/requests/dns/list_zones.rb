module Fog
  module DNS
    class PowerDNS
      class Real
        # Get details of a server's DNS zones
        #
        # ==== Parameters
        # * server<~String> - server id
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * zone<~Hash>:
        #       * 'id': <~String>,
        #       * "name": <~String>,
        #       * 'type': <~String>,
        #       * 'url': <~String>,
        #       * 'kind': <~String>,
        #       * 'serial': <~Integer>,
        #       * 'notified_serial': <~Int>,
        #       * 'masters': <~Array,
        #       * 'dnssec': <~Boolean>,
        #       * 'nsec3param': <~String>,
        #       * 'nsec3narrow': <~Boolean>,
        #       * 'presigned': <~Boolean>,
        #       * 'soa_edit': '<~String>',
        #       * 'soa_edit_api': '<~String>',
        #       * 'account': '<~String>',
        #       * 'nameservers': <~Array>,
        #       * 'servers': <~Array>,
        #       * 'recursion_desired': <~Boolean>,
        #       * 'records': <~Array>,
        #       * 'comments': <~Array>,
        #   * status<~Integer>  200 when successful

        def list_zones(server)
          request(
              :expects  => 200,
              :method   => 'GET',
              :path     => "/servers/#{server}/zones"
          ).body
        end

      end
    end
  end
end