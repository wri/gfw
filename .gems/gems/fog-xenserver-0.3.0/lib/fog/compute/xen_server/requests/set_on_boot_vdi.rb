module Fog
  module Compute
    class XenServer
      class Real
        def set_on_boot_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_on_boot" }, ref, value)
        end
      end
    end
  end
end
