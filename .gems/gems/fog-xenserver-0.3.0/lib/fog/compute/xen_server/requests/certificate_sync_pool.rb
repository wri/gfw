module Fog
  module Compute
    class XenServer
      class Real
        def certificate_sync_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.certificate_sync")
        end
      end
    end
  end
end
