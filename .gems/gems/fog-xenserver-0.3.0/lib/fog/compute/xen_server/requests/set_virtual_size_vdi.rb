module Fog
  module Compute
    class XenServer
      class Real
        def set_virtual_size_vdi(ref, int)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_virtual_size" }, ref, int)
        end
      end
    end
  end
end
