module Fog
  module Compute
    class XenServer
      class Real
        def pool_migrate_vdi(ref, sr, options)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.pool_migrate" }, ref, sr, options)
        end
      end
    end
  end
end
