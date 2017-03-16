module Fog
  module Compute
    class XenServer
      class Real
        def sync_database_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.sync_database")
        end
      end
    end
  end
end
