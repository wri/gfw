module Fog
  module Compute
    class XenServer
      class Real
        def join_pool(master_address, master_username, master_password)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.join" }, master_address, master_username, master_password)
        end
      end
    end
  end
end
