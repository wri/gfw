module Fog
  module Compute
    class XenServer
      class Real
        def set_vcpus_at_startup_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_VCPUs_at_startup" }, ref, value)
        end

        alias_method :set_vcpus_at_startup_vm, :set_vcpus_at_startup_server
      end
    end
  end
end
