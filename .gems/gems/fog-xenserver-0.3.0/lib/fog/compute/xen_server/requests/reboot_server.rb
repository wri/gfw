module Fog
  module Compute
    class XenServer
      class Real
        def reboot_server(ref, stype = "clean")
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "VM.#{stype}_reboot"}, ref)
        end

        alias_method :reboot_vm, :reboot_server

        def hard_reboot_server(ref)
          reboot_server(ref, "hard")
        end

        alias_method :hard_reboot_vm, :hard_reboot_server

        def clean_reboot_server(ref)
          reboot_server(ref, "clean")
        end

        alias_method :clean_reboot_vm, :clean_reboot_server
      end
    end
  end
end