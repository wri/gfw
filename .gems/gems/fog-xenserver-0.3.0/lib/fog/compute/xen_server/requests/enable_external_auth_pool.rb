module Fog
  module Compute
    class XenServer
      class Real
        def enable_external_auth_pool(ref, config, service_name, auth_type)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.enable_external_auth" }, ref, config, service_name, auth_type)
        end
      end
    end
  end
end
