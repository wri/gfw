module Fog
  module Compute
    class XenServer
      class Real
        def enable_local_storage_caching_pool(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.enable_local_storage_caching" }, ref)
        end
      end
    end
  end
end
