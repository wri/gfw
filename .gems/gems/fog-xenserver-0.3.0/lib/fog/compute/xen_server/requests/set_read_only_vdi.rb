module Fog
  module Compute
    class XenServer
      class Real
        def set_read_only_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_read_only" }, ref, value)
        end
      end
    end
  end
end
