module Fog
  module Compute
    class XenServer
      class Real
        def remove_ipv4_allowed_vif(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VIF.remove_ipv4_allowed" }, ref, value)
        end
      end
    end
  end
end
