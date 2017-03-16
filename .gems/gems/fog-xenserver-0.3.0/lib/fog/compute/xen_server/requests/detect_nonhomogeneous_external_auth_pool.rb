module Fog
  module Compute
    class XenServer
      class Real
        def detect_nonhomogeneous_external_auth_pool(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.detect_nonhomogeneous_external_auth" }, ref)
        end
      end
    end
  end
end
