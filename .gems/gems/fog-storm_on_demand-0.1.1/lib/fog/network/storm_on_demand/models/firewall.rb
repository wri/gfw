module Fog
  module Network
    class StormOnDemand
      class Firewall < Fog::Model
        attribute :allow
        attribute :rules
        attribute :ruleset
        attribute :type
      end
    end
  end
end
