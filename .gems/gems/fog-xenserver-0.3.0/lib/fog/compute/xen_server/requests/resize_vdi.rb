module Fog
  module Compute
    class XenServer
      class Real
        def resize_vdi(ref, size)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.resize" }, ref, size)
        end
      end
    end
  end
end
