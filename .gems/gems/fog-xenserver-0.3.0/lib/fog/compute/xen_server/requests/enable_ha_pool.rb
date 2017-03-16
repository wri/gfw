module Fog
  module Compute
    class XenServer
      class Real
        def enable_ha_pool(heartbeat_srs, configuration)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.enable_ha" }, heartbeat_srs, configuration)
        end
      end
    end
  end
end
