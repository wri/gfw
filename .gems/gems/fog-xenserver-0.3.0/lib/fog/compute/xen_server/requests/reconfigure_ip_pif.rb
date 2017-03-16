module Fog
  module Compute
    class XenServer
      class Real
        def reconfigure_ip_pif(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PIF.reconfigure_ip" }, ref)
        end
      end
    end
  end
end
