require 'fog/core/model'
module Fog
  module Compute
    class Aliyun
      class EipAddress < Fog::Model

        identity :id,             :aliases => 'AllocationId'

        attribute :allocated_at,  :aliases => 'AllocationTime'
        attribute :bandwidth,     :aliases => 'Bandwidth'
        attribute :server_id,     :aliases => 'InstanceId'
        attribute :charge_type,   :aliases => 'InternetChargeType'
        attribute :ip_address,    :aliases => ['IpAddress','EipAddress']
        attribute :opertion_locks,:aliases => 'OperationLocks'
        attribute :region_id,     :aliases => 'RegionId'
        attribute :state,         :aliases => 'Status'

        def destroy
          requires :id
          service.release_eip_address(id)
          true
        end

        def ready?
          requires :state
          state == 'Available'
        end

        def save(options={})
          # raise Fog::Errors::Error.new('Resaving an existing object may create a duplicate') if persisted?
          # requires :availability_zone
          options[:bandwidth] = bandwidth if bandwidth
          options[:internet_charge_type]=charge_type if charge_type
          
          data = Fog::JSON.decode(service.allocate_eip_address(options).body)
          merge_attributes(data)         
          true
        end


        def associate(new_server,options={})
          unless persisted?
            @server = new_server
          else
            @server = nil
            self.server_id = new_server.id
            service.associate_eip_address(server_id,id,options)
          end
        end

        def disassociate(new_server,options={})
            @server = nil
            self.server_id = new_server.id
          if persisted?
            service.unassociate_eip_address(server_id,id,options)
          end
          
        end

      end
    end
  end
end