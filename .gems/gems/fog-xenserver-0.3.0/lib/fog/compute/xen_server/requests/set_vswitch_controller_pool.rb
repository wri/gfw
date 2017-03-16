module Fog
  module Compute
    class XenServer
      class Real
        def set_vswitch_controller_pool(address)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.set_vswitch_controller" }, address)
        end
      end
    end
  end
end
