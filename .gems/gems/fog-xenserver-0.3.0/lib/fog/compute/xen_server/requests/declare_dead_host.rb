module Fog
  module Compute
    class XenServer
      class Real
        def declare_dead_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.declare_dead" }, ref)
        end
      end
    end
  end
end
