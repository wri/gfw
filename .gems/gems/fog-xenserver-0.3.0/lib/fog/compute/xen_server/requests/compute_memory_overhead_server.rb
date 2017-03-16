module Fog
  module Compute
    class XenServer
      class Real
        def compute_memory_overhead_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.compute_memory_overhead" }, ref)
        end

        alias_method :compute_memory_overhead_vm, :compute_memory_overhead_server
      end
    end
  end
end
