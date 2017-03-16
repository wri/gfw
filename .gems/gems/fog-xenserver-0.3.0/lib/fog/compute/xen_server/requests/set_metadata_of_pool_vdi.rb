module Fog
  module Compute
    class XenServer
      class Real
        def set_metadata_of_pool_vdi(ref, pool)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_metadata_of_pool" }, ref, pool)
        end
      end
    end
  end
end
