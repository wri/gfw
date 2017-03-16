module Fog
  module Compute
    class XenServer
      class Real
        def shutdown_agent_host
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "host.shutdown_agent")
        end
      end
    end
  end
end
