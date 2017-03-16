module Fog
  module Monitoring
    class StormOnDemand
      class Bandwidth < Fog::Model
        attribute :actual
        attribute :averages
        attribute :cost
        attribute :domain
        attribute :pricing
        attribute :projected
      end
    end
  end
end
