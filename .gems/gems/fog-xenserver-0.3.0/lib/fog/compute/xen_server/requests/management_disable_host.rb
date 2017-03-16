module Fog
  module Compute
    class XenServer
      class Real
        def management_disable_host
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "host.management_disable")
        end
      end
    end
  end
end
