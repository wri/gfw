module Fog
  module Compute
    class XenServer
      class Real
        def set_shared_sr(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.set_shared" }, ref, value)
        end
      end
    end
  end
end
