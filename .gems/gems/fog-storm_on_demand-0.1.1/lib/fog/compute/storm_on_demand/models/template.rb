module Fog
  module Compute
    class StormOnDemand
      class Template < Fog::Model
        identity :id
        attribute :name
        attribute :deprecated
        attribute :description
        attribute :manage_level
        attribute :os
        attribute :zone_availability
      end

      def restore(options)
        requires :identity
        service.restore_template({:id => identity}.merge!(options))
      end
    end
  end
end
