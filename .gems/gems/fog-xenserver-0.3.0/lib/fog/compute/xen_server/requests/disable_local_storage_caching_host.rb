module Fog
  module Compute
    class XenServer
      class Real
        def disable_local_storage_caching_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.disable_local_storage_caching" }, ref)
        end
      end
    end
  end
end
