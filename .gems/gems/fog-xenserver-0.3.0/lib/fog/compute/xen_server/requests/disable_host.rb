module Fog
  module Compute
    class XenServer
      class Real
        def disable_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.disable" }, ref)
        end
      end
    end
  end
end
