module Fog
  module Compute
    class Terremark
      # doc stub
      class Real
        # Get list of organizations
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Array>:
        #     * "description"<~String> - Description of organization
        #     * "links"<~Array> - An array of links to entities in the organization
        #     * "name"<~String> - Name of organization
        def organizations
          request(
            :expects => 200,
            :headers => auth_headers,
            :method => "POST",
            :parser => Fog::Parsers::Terremark::GetOrganizations.new,
            :path => "login"
          )
        end
      end

      # doc stub
      class Mock
        def organizations
          response = Excon::Response.new
          response.body = { "OrgList" => org_fixture }
          response.status = 200
          response.headers = Fog::Compute::Terremark::Mock.headers(response.body, "application/vnd.vmware.vcloud.orgList+xml")
          response
        end

        def org_fixture
          data[:organizations].map do |organization|
            {
              "name" => organization[:info][:name],
              "href" => "#{@base_url}/org/#{organization[:info][:id]}",
              "type" => "application/vnd.vmware.vcloud.org+xml"
            }
          end
        end
      end
    end
  end
end
