module Fog
  module Compute
    class XenServer
      class Real
        def set_hvm_shadow_multiplier_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_HVM_shadow_multiplier" }, ref, value)
        end

        alias_method :set_hvm_shadow_multiplier_vm, :set_hvm_shadow_multiplier_server
      end
    end
  end
end
