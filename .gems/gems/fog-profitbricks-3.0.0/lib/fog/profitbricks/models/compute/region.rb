module Fog
  module Compute
    class ProfitBricks
      class Region < Fog::Models::ProfitBricks::Base
        identity  :id,      :aliases => "locationId"

        attribute :name,    :aliases => "locationName"
        attribute :country, :aliases => "country"
      end
    end
  end
end
