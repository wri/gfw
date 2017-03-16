module Fog
  module Compute
    class Terremark
      class Vdcs < Fog::Collection
        model Fog::Compute::Terremark::Vdc

        def all
          data = service.get_organization(organization_id).body["Links"].select do |entity|
            entity["type"] == "application/vnd.vmware.vcloud.vdc+xml"
          end
          load(data)
        end

        def get(vdc_id)
          if vdc_id && vdc = service.get_vdc(vdc_id).body
            new(vdc)
          elsif !vdc_id
            nil
          end
        rescue Excon::Errors::Forbidden
          nil
        end

        def organization_id
          @organization_id ||= service.default_organization_id
        end

        private

        def organization_id=(new_organization_id)
          @organization_id = new_organization_id
        end
      end
    end
  end
end
