module Fog
  module Compute
    class Terremark
      class Networks < Fog::Collection
        model Fog::Compute::Terremark::Network

        def all
          data = service.get_vdc(vdc_id).body["AvailableNetworks"].map do |network|
            service.get_network(network["href"].split("/").last).body
          end
          load(data)
        end

        def get(network_id)
          network = service.get_network(network_id).body
          if network_id && network
            new(network)
          elsif !network_id
            nil
          end
        rescue Excon::Errors::Forbidden
          nil
        end

        def vdc_id
          @vdc_id ||= service.default_vdc_id
        end

        private

        def vdc_id=(new_vdc_id)
          @vdc_id = new_vdc_id
        end
      end
    end
  end
end
