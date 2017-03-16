module Fog
  module Compute
    class XenServer
      class Real
        def copy_vdi(ref, sr)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.copy" }, ref, sr)
        end
      end
    end
  end
end
