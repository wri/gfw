module Fog
  module Compute
    class XenServer
      class Real
        def snapshot_vdi(ref, driver_params)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.snapshot" }, ref, driver_params)
        end
      end
    end
  end
end
