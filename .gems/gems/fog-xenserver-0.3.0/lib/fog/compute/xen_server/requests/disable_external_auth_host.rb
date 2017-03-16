module Fog
  module Compute
    class XenServer
      class Real
        def disable_external_auth_host(ref, config)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.disable_external_auth" }, ref, config)
        end
      end
    end
  end
end
