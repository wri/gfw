module Fog
  module Compute
    class XenServer
      class Real
        def clean_reboot_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.clean_reboot" }, ref)
        end

        alias_method :clean_reboot_vm, :clean_reboot_server
      end
    end
  end
end
