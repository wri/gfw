module Fog
  module Compute
    class XenServer
      class Real
        def power_on_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.power_on" }, ref)
        end
      end
    end
  end
end
