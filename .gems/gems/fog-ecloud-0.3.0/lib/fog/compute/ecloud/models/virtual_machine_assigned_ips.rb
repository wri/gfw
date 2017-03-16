require File.expand_path("../virtual_machine_assigned_ip", __FILE__)

module Fog
  module Compute
    class Ecloud
      class VirtualMachineAssignedIps < Fog::Ecloud::Collection
        identity :virtual_machine_id

        model Fog::Compute::Ecloud::VirtualMachineAssignedIp

        def all
          data = service.get_virtual_machine_assigned_ips(identity).body
          load(data)
        end

        def get
          if data = service.get_virtual_machine_assigned_ip(identity)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
