require 'fog/core/model'

module Fog
  module Network
    class SakuraCloud
      class Interface < Fog::Model
        identity :id, :aliases => 'ID'
        attribute :macaddress, :aliases => 'MACAddress'
        attribute :ipaddress, :aliases => 'IPAddress'
        attribute :user_ipaddress, :aliases => 'UserIPAddress'
        attribute :switch, :aliases => 'Switch'
        attribute :server, :aliases => 'Server'

        def delete
          service.delete_interface(identity)
          true
        end
        alias_method :destroy, :delete

        def connect_to_switch(switch_id)
          service.connect_interface_to_switch(identity, switch_id)
          true
        end
      end
    end
  end
end
