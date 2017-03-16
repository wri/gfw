module Fog
  module Compute
    class XenServer
      class Real
        def set_physical_utilisation_sr(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.set_physical_utilisation" }, ref, value)
        end
      end
    end
  end
end
