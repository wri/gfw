module Fog
  module Compute
    class XenServer
      class Real
        def certificate_list_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.certificate_list")
        end
      end
    end
  end
end
