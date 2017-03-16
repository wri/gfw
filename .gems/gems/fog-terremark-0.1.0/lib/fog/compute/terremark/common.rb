module Fog
  module Compute
    class Terremark
      # doc stub
      module Common
        def default_organization_id
          @default_organization_id ||= begin
            org_list = organizations.body["OrgList"]
            if org_list.length == 1
              org_list.first["href"].split("/").last.to_i
            else
              nil
            end
          end
        end
      end
    end
  end
end
