module Fog
  module Compute
    class XenServer
      class Real
        def shutdown_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.shutdown" }, ref)
        end
      end
    end
  end
end
