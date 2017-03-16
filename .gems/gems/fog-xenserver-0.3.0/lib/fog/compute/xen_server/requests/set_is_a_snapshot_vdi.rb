module Fog
  module Compute
    class XenServer
      class Real
        def set_is_a_snapshot_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_is_a_snapshot" }, ref, value)
        end
      end
    end
  end
end
