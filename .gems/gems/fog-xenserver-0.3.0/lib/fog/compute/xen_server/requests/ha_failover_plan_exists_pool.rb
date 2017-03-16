module Fog
  module Compute
    class XenServer
      class Real
        def ha_failover_plan_exists_pool(n)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.ha_failover_plan_exists" }, n)
        end
      end
    end
  end
end
