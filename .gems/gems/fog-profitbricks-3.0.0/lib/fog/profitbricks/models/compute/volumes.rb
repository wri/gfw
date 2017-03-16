require File.expand_path('../volume', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Volumes < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::Volume

        def all(datacenter_id)
          result = service.get_all_volumes(datacenter_id)

          volumes = result.body['items'].each { |volume| volume['datacenter_id'] = datacenter_id }
          result.body['items'] = volumes

          load(result.body['items'].each { |volume| flatten(volume) })
        end

        def get(datacenter_id, volume_id)
          response = service.get_volume(datacenter_id, volume_id)
          volume = response.body

          volume['datacenter_id'] = datacenter_id
          new(flatten(volume))
        end
      end
    end
  end
end
