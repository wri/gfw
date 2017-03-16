module Fog
  module Compute
    class XenServer
      class Real
        def set_shadow_multiplier_live_server(ref, multiplier)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_shadow_multiplier_live" }, ref, multiplier)
        end

        alias_method :set_shadow_multiplier_live_vm, :set_shadow_multiplier_live_server
      end
    end
  end
end
