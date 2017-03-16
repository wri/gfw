module Fog
  module Compute
    class XenServer
      class Real
        def compute_memory_overhead_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.compute_memory_overhead" }, ref)
        end
      end
    end
  end
end
