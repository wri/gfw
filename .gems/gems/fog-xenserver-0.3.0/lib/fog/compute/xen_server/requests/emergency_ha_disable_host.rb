module Fog
  module Compute
    class XenServer
      class Real
        def emergency_ha_disable_host
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "host.emergency_ha_disable")
        end
      end
    end
  end
end
