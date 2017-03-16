module Fog
  module Compute
    class XenServer
      class Real
        def set_ipv4_allowed_vif(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VIF.set_ipv4_allowed" }, ref, value)
        end
      end
    end
  end
end
