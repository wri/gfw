module Fog
  module Compute
    class ProfitBricks
      class Location < Fog::Models::ProfitBricks::Base
        identity  :id

        attribute :name
        attribute :features

        attr_accessor :options

        def initialize(attributes = {})
          super
        end
      end
    end
  end
end
