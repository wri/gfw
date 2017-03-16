module Fog
  module Compute
    class DigitalOcean
      class Volume < Fog::Model
        identity :id
        attribute :name
        attribute :region
        attribute :droplet_ids
        attribute :description
        attribute :size_gigabytes
        attribute :created_at
      end
    end
  end
end
