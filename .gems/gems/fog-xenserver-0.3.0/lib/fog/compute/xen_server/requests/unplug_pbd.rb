module Fog
  module Compute
    class XenServer
      class Real
        def unplug_pbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PBD.unplug" }, ref)
        end
      end
    end
  end
end
