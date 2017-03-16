module Fog
  module Compute
    class XenServer
      class Real
        def enable_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.enable" }, ref)
        end
      end
    end
  end
end
