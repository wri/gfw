module Fog
  module Compute
    class XenServer
      class Real
        def compute_free_memory_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.compute_free_memory" }, ref)
        end
      end
    end
  end
end
