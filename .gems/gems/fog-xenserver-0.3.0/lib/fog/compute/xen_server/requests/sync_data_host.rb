module Fog
  module Compute
    class XenServer
      class Real
        def sync_data_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.sync_data" }, ref)
        end
      end
    end
  end
end
