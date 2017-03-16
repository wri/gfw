module Fog
  module Compute
    class XenServer
      class Real
        def disable_local_storage_caching_pool(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.disable_local_storage_caching" }, ref)
        end
      end
    end
  end
end
