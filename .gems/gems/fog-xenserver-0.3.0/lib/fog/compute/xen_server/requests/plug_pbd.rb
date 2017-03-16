module Fog
  module Compute
    class XenServer
      class Real
        def plug_pbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PBD.plug" }, ref)
        end
      end
    end
  end
end
