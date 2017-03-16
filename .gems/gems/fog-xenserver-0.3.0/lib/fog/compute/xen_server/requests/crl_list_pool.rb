module Fog
  module Compute
    class XenServer
      class Real
        def crl_list_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.crl_list")
        end
      end
    end
  end
end
