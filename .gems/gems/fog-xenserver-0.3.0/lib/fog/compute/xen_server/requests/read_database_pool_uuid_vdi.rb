module Fog
  module Compute
    class XenServer
      class Real
        def read_database_pool_uuid_vdi(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.read_database_pool_uuid" }, ref)
        end
      end
    end
  end
end
