module Fog
  module Network
    class StormOnDemand
      class NetworkIP < Fog::Model
        identity :id

        attribute :broadcast
        attribute :gateway
        attribute :ip
        attribute :netmask
        attribute :reverse_dns
      end
    end
  end
end
