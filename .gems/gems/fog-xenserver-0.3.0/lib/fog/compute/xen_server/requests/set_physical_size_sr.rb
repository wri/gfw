module Fog
  module Compute
    class XenServer
      class Real
        def set_physical_size_sr(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.set_physical_size" }, ref, value)
        end
      end
    end
  end
end
