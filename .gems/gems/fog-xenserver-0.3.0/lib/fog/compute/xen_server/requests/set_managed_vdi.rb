module Fog
  module Compute
    class XenServer
      class Real
        def set_managed_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_managed" }, ref, value)
        end
      end
    end
  end
end
