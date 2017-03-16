module Fog
  module Compute
    class XenServer
      class Real
        def enable_redo_log_pool(sr)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.enable_redo_log" }, sr)
        end
      end
    end
  end
end
