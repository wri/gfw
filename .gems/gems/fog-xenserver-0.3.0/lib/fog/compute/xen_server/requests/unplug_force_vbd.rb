module Fog
  module Compute
    class XenServer
      class Real
        def unplug_force_vbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.unplug_force" }, ref)
        end
      end
    end
  end
end
