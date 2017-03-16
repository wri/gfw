module Fog
  module Compute
    class XenServer
      class Real
        def clone_vdi(ref, driver_params)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.clone" }, ref, driver_params)
        end
      end
    end
  end
end
