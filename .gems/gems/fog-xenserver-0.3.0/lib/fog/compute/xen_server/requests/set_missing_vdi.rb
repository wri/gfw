module Fog
  module Compute
    class XenServer
      class Real
        def set_missing_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_missing" }, ref, value)
        end
      end
    end
  end
end
