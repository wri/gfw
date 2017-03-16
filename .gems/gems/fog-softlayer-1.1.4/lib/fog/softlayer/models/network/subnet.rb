#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Network
    class Softlayer
      class Subnet < Fog::Model
        identity :id

        attribute :name,                  :aliases => 'note'
        attribute :network_id,            :aliases => 'networkIdentifier'
        attribute :vlan_id,               :aliases => 'networkVlanId'
        attribute :cidr
        attribute :ip_version,            :aliases => 'version'
        attribute :type,                  :aliases => 'subnetType'
        attribute :gateway_ip,            :aliases => 'gateway'
        attribute :broadcast,             :aliases => 'broadcastAddress'
        attribute :gateway
        attribute :datacenter,            :squash => :name
        attribute :address_space,         :aliases => 'addressSpace'

        def addresses
          @addresses ||= begin
            if attributes['ipAddresses'].nil?
              []
            else
              attributes['ipAddresses'].map do |address|
                service.ips.get(address['id'])
              end
            end
          end
        end

        #def addresses=(addresses)
        #  @addresses = addresses
        #end

        def portable?
          type == 'ROUTED_TO_VLAN'
        end

        def private?
          address_space == 'PRIVATE'
        end

        def public?
          not private?
        end

        def save
          requires :network_id, :cidr, :ip_version
          identity ? update : create
        end

        def create(address_count=4)
          requires :vlan_id
          response = service.create_subnet(build_order(address_count)).body
          merge_attributes(response)
          #merge_attributes(service.create_subnet(self.network_id,
          #                                       self.cidr,
          #                                       self.ip_version,
          #                                       self.attributes).body['subnet'])
          self
        end

        def update
          requires :id, :network_id, :cidr, :ip_version
          merge_attributes(service.update_subnet(self.id,
                                                 self.attributes).body['subnet'])
          self
        end

        def destroy
          requires :id
          service.delete_subnet(self.id)
          true
        end

        private

        def build_order(address_count)
          order = {
              'complexType' => 'SoftLayer_Container_Product_Order_Network_Subnet',
              'location' => datacenter,
              'quantity' =>1,
              'packageId' =>0,
              'prices' =>[
                  {'id' => portable? ? service.get_portable_subnet_price_code(address_count, public?) : service.get_subnet_price_code }
              ]
          }
          order['endPointVlanId'] = vlan_id if portable?
          order
        end
      end
    end
  end
end
