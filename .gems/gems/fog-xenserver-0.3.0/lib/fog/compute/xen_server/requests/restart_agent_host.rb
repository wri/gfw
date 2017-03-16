module Fog
  module Compute
    class XenServer
      class Real
        def restart_agent_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.restart_agent" }, ref)
        end
      end
    end
  end
end
