module Fog
  module Compute
    class XenServer
      class Real
        def get_server_localtime_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_server_localtime" }, ref)
        end
      end
    end
  end
end
