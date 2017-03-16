module Fog
  module Compute
    class XenServer
      class Real
        def set_snapshot_time_vdi(ref, datetime)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_snapshot_time" }, ref, datetime)
        end
      end
    end
  end
end
