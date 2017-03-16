module Fog
  module Compute
    class XenServer
      class Real
        def evacuate_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.evacuate" }, ref)
        end
      end
    end
  end
end
