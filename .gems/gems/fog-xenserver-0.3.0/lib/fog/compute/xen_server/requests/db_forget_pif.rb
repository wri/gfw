module Fog
  module Compute
    class XenServer
      class Real
        def db_forget_pif(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PIF.db_forget" }, ref)
        end
      end
    end
  end
end
