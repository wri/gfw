module Fog
  module Compute
    class DigitalOcean
      class Region < Fog::Model
        identity :slug
        attribute :name
        attribute :sizes
        attribute :available
        attribute :features
      end
    end
  end
end