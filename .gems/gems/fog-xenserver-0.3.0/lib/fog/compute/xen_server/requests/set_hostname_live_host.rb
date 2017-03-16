module Fog
  module Compute
    class XenServer
      class Real
        def set_hostname_live_host(ref, hostname)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.set_hostname_live" }, ref, hostname)
        end
      end
    end
  end
end
