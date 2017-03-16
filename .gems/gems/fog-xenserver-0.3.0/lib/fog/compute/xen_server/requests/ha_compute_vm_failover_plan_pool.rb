module Fog
  module Compute
    class XenServer
      class Real
        def ha_compute_vm_failover_plan_pool(failed_hosts, failed_vms)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.ha_compute_vm_failover_plan" }, failed_hosts, failed_vms)
        end
      end
    end
  end
end
