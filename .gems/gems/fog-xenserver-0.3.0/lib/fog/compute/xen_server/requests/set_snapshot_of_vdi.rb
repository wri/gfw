module Fog
  module Compute
    class XenServer
      class Real
        def set_snapshot_of_vdi(ref, vdi)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_snapshot_of" }, ref, vdi)
        end
      end
    end
  end
end
