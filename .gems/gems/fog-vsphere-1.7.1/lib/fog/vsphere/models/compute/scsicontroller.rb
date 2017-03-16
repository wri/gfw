module Fog
  module Compute
    class Vsphere
      class SCSIController < Fog::Model
        attribute :shared_bus
        attribute :type
        attribute :unit_number
        attribute :key, :type => :integer
        attribute :server_id

        def initialize(attributes = {})
          super
          self.key ||= 1000
        end

        def to_s
          "#{type} ##{key}: shared: #{shared_bus}, unit_number: #{unit_number}"
        end
      end
    end
  end
end
