module Fog
  module Compute
    class XenServer
      class Real
        def set_virtual_allocation_sr(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.set_virtual_allocation" }, ref, value)
        end
      end
    end
  end
end
