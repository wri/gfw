module Fog
  module Compute
    class XenServer
      class Real
        def crl_uninstall_pool(name)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.crl_uninstall" }, name)
        end
      end
    end
  end
end
