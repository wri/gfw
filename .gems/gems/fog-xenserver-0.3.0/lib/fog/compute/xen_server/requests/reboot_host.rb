module Fog
  module Compute
    class XenServer
      class Real
        def reboot_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.reboot" }, ref)
        end
      end
    end
  end
end
