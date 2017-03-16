module Fog
  module Compute
    class XenServer
      class Real
        def set_memory_dynamic_min_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_memory_dynamic_min" }, ref, value)
        end

        alias_method :set_memory_dynamic_min_vm, :set_memory_dynamic_min_server
      end
    end
  end
end
