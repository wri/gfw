module Fog
  module Compute
    class XenServer
      class Real
        def disable_ha_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.disable_ha")
        end
      end
    end
  end
end
