require File.expand_path('../datacenter', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Datacenters < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::Datacenter

        def all
          result = service.get_all_datacenters

          load(result.body['items'].each { |dc| flatten(dc) })
        end

        def get(id)
          response = service.get_datacenter(id)

          datacenter = response.body

          new(flatten(datacenter))
        end
      end
    end
  end
end
