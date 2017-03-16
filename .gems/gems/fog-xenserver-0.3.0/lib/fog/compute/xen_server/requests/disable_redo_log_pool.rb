module Fog
  module Compute
    class XenServer
      class Real
        def disable_redo_log_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.disable_redo_log")
        end
      end
    end
  end
end
