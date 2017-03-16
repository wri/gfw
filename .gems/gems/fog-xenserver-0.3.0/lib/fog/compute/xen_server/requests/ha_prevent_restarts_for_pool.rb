module Fog
  module Compute
    class XenServer
      class Real
        def ha_prevent_restarts_for_pool(seconds)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.ha_prevent_restarts_for" }, seconds)
        end
      end
    end
  end
end
