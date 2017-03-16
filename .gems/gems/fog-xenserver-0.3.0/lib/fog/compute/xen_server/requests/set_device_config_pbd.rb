module Fog
  module Compute
    class XenServer
      class Real
        def set_device_config_pbd(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PBD.set_device_config" }, ref, value)
        end
      end
    end
  end
end
