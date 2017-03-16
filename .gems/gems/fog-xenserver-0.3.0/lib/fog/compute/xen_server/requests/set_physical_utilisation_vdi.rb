module Fog
  module Compute
    class XenServer
      class Real
        def set_physical_utilisation_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_physical_utilisation" }, ref, value)
        end
      end
    end
  end
end
