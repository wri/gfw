module Fog
  module Compute
    class XenServer
      class Real
        def set_allow_caching_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_allow_caching" }, ref, value)
        end
      end
    end
  end
end
