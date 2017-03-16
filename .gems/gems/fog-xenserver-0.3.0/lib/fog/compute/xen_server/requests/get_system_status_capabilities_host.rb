module Fog
  module Compute
    class XenServer
      class Real
        def get_system_status_capabilities_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_system_status_capabilities" }, ref)
        end
      end
    end
  end
end
