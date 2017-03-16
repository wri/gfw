module Fog
  module Compute
    class XenServer
      class Real
        def list_methods_host
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "host.list_methods")
        end
      end
    end
  end
end
