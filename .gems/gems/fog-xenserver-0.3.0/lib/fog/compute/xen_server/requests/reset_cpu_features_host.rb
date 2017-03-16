module Fog
  module Compute
    class XenServer
      class Real
        def reset_cpu_features_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.reset_cpu_features" }, ref)
        end
      end
    end
  end
end
