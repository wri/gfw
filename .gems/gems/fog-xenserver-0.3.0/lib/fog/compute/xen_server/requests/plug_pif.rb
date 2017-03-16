module Fog
  module Compute
    class XenServer
      class Real
        def plug_pif(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PIF.plug" }, ref)
        end
      end
    end
  end
end
