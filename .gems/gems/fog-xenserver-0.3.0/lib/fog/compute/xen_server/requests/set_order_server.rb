module Fog
  module Compute
    class XenServer
      class Real
        def set_order_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_order" }, ref, value)
        end

        alias_method :set_order_vm, :set_order_server
      end
    end
  end
end
