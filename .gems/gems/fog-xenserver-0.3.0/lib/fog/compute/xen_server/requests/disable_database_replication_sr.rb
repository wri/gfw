module Fog
  module Compute
    class XenServer
      class Real
        def disable_database_replication_sr(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.disable_database_replication" }, ref)
        end
      end
    end
  end
end
