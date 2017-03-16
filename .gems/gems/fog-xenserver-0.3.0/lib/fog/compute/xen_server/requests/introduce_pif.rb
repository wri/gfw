module Fog
  module Compute
    class XenServer
      class Real
        def introduce_pif(host, mac, device)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PIF.introduce" }, host, mac, device)
        end
      end
    end
  end
end
