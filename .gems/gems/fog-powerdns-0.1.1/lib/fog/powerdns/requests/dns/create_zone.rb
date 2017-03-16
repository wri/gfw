module Fog
  module DNS
    class PowerDNS
      class Real
        # Create a single zone in PowerDNS
        # Server, name and nameservers LIST are required
        #
        # ==== Parameters
        # * server<~String> - Server ID
        # * name<~String> - Name of domain
        # * nameservers<~Array> - List of nameservers
        # * options<~Hash> - Other options
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
        #   * status<~Integer>  201 when successful

        def create_zone(server, name, nameservers, options = {})
          body = {
              "name" => name,
              "nameservers" => nameservers
          }

          options.each { |option, value|
            body[option] = value;
          }

          request(
              :body     => Fog::JSON.encode(body),
              :expects  => 201,
              :method   => 'POST',
              :path     => "/servers/#{server}/zones"
          ).body
        end
      end
      class Mock
        # TODO: Write this
      end
    end
  end
end