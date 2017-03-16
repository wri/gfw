module Fog
  module Support
    class StormOnDemand
      class Alert < Fog::Model
        attribute :message
        attribute :subject
      end
    end
  end
end
