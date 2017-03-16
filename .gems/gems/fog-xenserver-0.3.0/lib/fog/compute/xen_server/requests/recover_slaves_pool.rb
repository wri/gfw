module Fog
  module Compute
    class XenServer
      class Real
        def recover_slaves_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.recover_slaves")
        end
      end
    end
  end
end
