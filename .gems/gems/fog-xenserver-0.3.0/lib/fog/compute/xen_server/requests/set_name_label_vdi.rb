module Fog
  module Compute
    class XenServer
      class Real
        def set_name_label_vdi(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.set_name_label" }, ref, value)
        end
      end
    end
  end
end
