module Fog
  module Compute
    class XenServer
      class Real
        def resize_online_vdi(ref, size)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.resize_online" }, ref, size)
        end
      end
    end
  end
end
