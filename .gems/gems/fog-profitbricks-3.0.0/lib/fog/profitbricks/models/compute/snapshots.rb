require File.expand_path('../snapshot', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Snapshots < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::Snapshot

        def all
          result = service.get_all_snapshots

          load(result.body['items'].each { |snapshot| flatten(snapshot) })
        end

        def get(id)
          snapshot = service.get_snapshot(id).body

          new(flatten(snapshot))
        end
      end
    end
  end
end
