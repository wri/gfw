module Fog
  module Compute
    class XenServer
      class Real
        def set_ha_restart_priority_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_ha_restart_priority" }, ref, value)
        end

        alias_method :set_ha_restart_priority_vm, :set_ha_restart_priority_server
      end
    end
  end
end
