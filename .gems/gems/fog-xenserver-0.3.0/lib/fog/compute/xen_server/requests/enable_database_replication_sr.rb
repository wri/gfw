module Fog
  module Compute
    class XenServer
      class Real
        def enable_database_replication_sr(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.enable_database_replication" }, ref)
        end
      end
    end
  end
end
