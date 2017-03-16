module Fog
  module Compute
    class XenServer
      class Real
        def disable_external_auth_pool(ref, config)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.disable_external_auth" }, ref, config)
        end
      end
    end
  end
end
