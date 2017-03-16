module Fog
  module Compute
    class XenServer
      class Real
        def eject_vbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.eject" }, ref)
        end
      end
    end
  end
end
