module Fog
  module Monitoring
    class StormOnDemand
      class MonitorService < Fog::Model
        attribute :can_monitor
        attribute :enabled
        attribute :services
        attribute :uniq_id
        attribute :unmonitored
      end
    end
  end
end
