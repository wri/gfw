module Fog
  module Compute
    class Terremark
      class InternetServices < Fog::Collection
        model Fog::Compute::Terremark::InternetService

        def all
          data = service.get_internet_services(vdc_id).body["InternetServices"]
          load(data)
        end

        def get(service_id)
          service.get_internet_services(vdc_id)
          internet_service = services.body["InternetServices"].select {|item| item["Id"] == service_id}
          new(internet_service)
        end

        def vdc_id
          @vdc_id ||= service.default_vdc_id
        end
      end
    end
  end
end
