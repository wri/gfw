module Fog
  module Compute
    class XenServer
      class Real
        def management_reconfigure_host(pif)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.management_reconfigure" }, pif)
        end
      end
    end
  end
end
