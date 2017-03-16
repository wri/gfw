module Fog
  module Compute
    class XenServer
      class Real
        def get_license_state_pool(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.get_license_state" }, ref)
        end
      end
    end
  end
end
