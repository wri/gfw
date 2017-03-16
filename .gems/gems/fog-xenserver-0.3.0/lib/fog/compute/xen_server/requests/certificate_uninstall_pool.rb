module Fog
  module Compute
    class XenServer
      class Real
        def certificate_uninstall_pool(string)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.certificate_uninstall" }, string)
        end
      end
    end
  end
end
