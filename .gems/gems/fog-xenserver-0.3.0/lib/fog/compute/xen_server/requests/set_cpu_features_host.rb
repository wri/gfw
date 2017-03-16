module Fog
  module Compute
    class XenServer
      class Real
        def set_cpu_features_host(ref, features)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.set_cpu_features" }, ref, features)
        end
      end
    end
  end
end
