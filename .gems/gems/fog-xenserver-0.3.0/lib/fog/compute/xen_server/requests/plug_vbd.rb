module Fog
  module Compute
    class XenServer
      class Real
        def plug_vbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.plug" }, ref)
        end
      end
    end
  end
end
