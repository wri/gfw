module Fog
  module Compute
    class XenServer
      class Real
        def send_sysrq_server(ref, key)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.send_sysrq" }, ref, key)
        end

        alias_method :send_sysrq_vm, :send_sysrq_server
      end
    end
  end
end
