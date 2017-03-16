#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Compute
    class Softlayer
      class NetworkComponent < Fog::Model
        identity :id

        attribute :name
        attribute :port
        attribute :mac_address,               :aliases => 'macAddress'
        attribute :max_speed,                 :aliases => 'maxSpeed'
        attribute :modify_date,               :aliases => 'modifyDate'
        attribute :status
        attribute :speed
        attribute :primary_ip_address,        :aliases => 'primaryIpAddress'

        def save
          raise "#{self.class.name} objects are readonly."
        end

        def create
          raise "#{self.class.name} objects are readonly."
        end

        def update
          raise "#{self.class.name} objects are readonly."
        end

        def destroy
          raise "#{self.class.name} objects are readonly."
        end

      end
    end
  end
end
