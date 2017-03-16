module Fog
  module Compute
    class Terremark
      class NodeServices < Fog::Collection
        model Fog::Compute::Terremark::NodeService

        def all(internet_service_id)
          data = service.get_node_services(internet_service_id).body["NodeServices"]
          load(data)
        end
      end
    end
  end
end
