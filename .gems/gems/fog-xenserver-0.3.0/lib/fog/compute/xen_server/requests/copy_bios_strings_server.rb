module Fog
  module Compute
    class XenServer
      class Real
        def copy_bios_strings_server(ref, host)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.copy_bios_strings" }, ref, host)
        end

        alias_method :copy_bios_strings_vm, :copy_bios_strings_server
      end
    end
  end
end
