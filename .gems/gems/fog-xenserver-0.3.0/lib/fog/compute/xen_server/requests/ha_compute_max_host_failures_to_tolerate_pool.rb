module Fog
  module Compute
    class XenServer
      class Real
        def ha_compute_max_host_failures_to_tolerate_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.ha_compute_max_host_failures_to_tolerate")
        end
      end
    end
  end
end
