module Fog
  module Compute
    class XenServer
      class Real
        def set_ipv6_allowed_vif(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VIF.set_ipv6_allowed" }, ref, value)
        end
      end
    end
  end
end
