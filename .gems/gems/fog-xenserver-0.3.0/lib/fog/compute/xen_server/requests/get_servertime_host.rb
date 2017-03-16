module Fog
  module Compute
    class XenServer
      class Real
        def get_servertime_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_servertime" }, ref)
        end
      end
    end
  end
end
