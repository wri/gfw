module Fog
  module Compute
    class XenServer
      class Real
        def unplug_vbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.unplug" }, ref)
        end
      end
    end
  end
end
