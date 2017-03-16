module Fog
  module Compute
    class XenServer
      class Real
        def set_name_description_sr(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.set_name_description" }, ref, value)
        end
      end
    end
  end
end
