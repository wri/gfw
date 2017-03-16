module Fog
  module Compute
    class XenServer
      class Real
        def set_protection_policy_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_protection_policy" }, ref, value)
        end

        alias_method :set_protection_policy_vm, :set_protection_policy_server
      end
    end
  end
end
