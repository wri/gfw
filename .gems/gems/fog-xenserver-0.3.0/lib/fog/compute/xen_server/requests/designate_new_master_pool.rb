module Fog
  module Compute
    class XenServer
      class Real
        def designate_new_master_pool(host)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.designate_new_master" }, host)
        end
      end
    end
  end
end
