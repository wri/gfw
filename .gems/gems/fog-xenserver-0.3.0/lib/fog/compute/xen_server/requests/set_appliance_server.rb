module Fog
  module Compute
    class XenServer
      class Real
        def set_appliance_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_appliance" }, ref, value)
        end

        alias_method :set_appliance_vm, :set_appliance_server
      end
    end
  end
end
