module Fog
  module Compute
    class XenServer
      class Real
        def plug_vif(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VIF.plug" }, ref)
        end
      end
    end
  end
end
