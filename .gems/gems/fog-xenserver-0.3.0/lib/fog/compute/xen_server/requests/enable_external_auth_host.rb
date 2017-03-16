module Fog
  module Compute
    class XenServer
      class Real
        def enable_external_auth_host(ref, config, name, auth_type)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.enable_external_auth" }, ref, config, name, auth_type)
        end
      end
    end
  end
end
