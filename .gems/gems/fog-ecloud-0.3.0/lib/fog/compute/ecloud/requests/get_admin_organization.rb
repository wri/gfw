module Fog
  module Compute
    class Ecloud
      class Real
        basic_request :get_admin_organization
      end

      class Mock
        def get_admin_organization(uri)
          organization_id = id_from_uri(uri)
          admin_organization = data[:admin_organizations][organization_id]

          if admin_organization
            body = Fog::Ecloud.slice(admin_organization, :id, :organization_id)

            response(:body => body)
          else
            body = "<Error message=\"Resource Not Found\" majorErrorCode=\"404\" minorErrorCode=\"ResourceNotFound\" />"
            response(:body => body, :expects => 200, :status => 404)
          end
        end
      end
    end
  end
end
