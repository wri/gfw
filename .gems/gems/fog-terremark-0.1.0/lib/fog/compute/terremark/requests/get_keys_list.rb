module Fog
  module Compute
    class Terremark
      class Real
        # Get list of SSH keys for an organization
        #
        # ==== Parameters
        # * organization_id<~Integer> - Id of organization to lookup
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * "description"<~String> - Description of organization
        #     * "links"<~Array> - An array of links to entities in the organization
        #       * "href"<~String> - location of link
        #       * "name"<~String> - name of link
        #       * "rel"<~String> - action to perform
        #       * "type"<~String> - type of link
        def get_keys_list(organization_id)
          response = request(
            :expects  => 200,
            :method   => "GET",
            :parser   => Fog::Parsers::Terremark::GetKeysList.new,
            :path     => "api/extensions/v1.6/org/#{organization_id}/keys",
            :override_path => true
          )
          response
        end
      end
    end
  end
end
