module Fog
  module Compute
    class XenServer
      class Real
        def local_management_reconfigure_host(interface)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.local_management_reconfigure" }, interface)
        end
      end
    end
  end
end
