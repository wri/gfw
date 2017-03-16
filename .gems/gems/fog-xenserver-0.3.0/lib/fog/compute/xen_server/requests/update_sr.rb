module Fog
  module Compute
    class XenServer
      class Real
        def update_sr(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.update" }, ref)
        end
      end
    end
  end
end
