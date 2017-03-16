module Fog
  module Compute
    class XenServer
      class Real
        def eject_pool(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.eject" }, ref)
        end
      end
    end
  end
end
