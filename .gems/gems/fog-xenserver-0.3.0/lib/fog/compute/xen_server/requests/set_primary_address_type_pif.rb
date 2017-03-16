module Fog
  module Compute
    class XenServer
      class Real
        def set_primary_address_type_pif(ref, primary_address_type)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PIF.set_primary_address_type" }, ref, primary_address_type)
        end
      end
    end
  end
end
