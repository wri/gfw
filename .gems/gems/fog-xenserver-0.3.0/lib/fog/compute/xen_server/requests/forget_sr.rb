module Fog
  module Compute
    class XenServer
      class Real
        def forget_sr(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.forget" }, ref)
        end
      end
    end
  end
end
