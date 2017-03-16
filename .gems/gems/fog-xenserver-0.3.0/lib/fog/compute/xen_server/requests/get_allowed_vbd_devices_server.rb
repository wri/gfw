module Fog
  module Compute
    class XenServer
      class Real
        def get_allowed_vbd_devices_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.get_allowed_VBD_devices" }, ref)
        end

        alias_method :get_allowed_vbd_devices_vm, :get_allowed_vbd_devices_server
      end
    end
  end
end
