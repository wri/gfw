module Fog
  module Compute
    class XenServer
      class Real
        def assert_can_host_ha_statefile_sr(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.assert_can_host_ha_statefile" }, ref)
        end
      end
    end
  end
end
