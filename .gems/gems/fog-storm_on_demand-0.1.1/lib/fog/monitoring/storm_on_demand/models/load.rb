module Fog
  module Monitoring
    class StormOnDemand
      class Load < Fog::Model
        attribute :disk
        attribute :domain
        attribute :loadavg
        attribute :memory
        attribute :proc
        attribute :uptime
      end
    end
  end
end
