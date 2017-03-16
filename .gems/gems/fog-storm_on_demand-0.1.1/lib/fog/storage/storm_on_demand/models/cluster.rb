module Fog
  module Storage
    class StormOnDemand
      class Cluster < Fog::Model
        identity :id
        attribute :description
        attribute :zone
      end
    end
  end
end
