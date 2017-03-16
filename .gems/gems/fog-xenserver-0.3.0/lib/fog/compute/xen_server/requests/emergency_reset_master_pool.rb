module Fog
  module Compute
    class XenServer
      class Real
        def emergency_reset_master_pool(master_address)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.emergency_reset_master" }, master_address)
        end
      end
    end
  end
end
