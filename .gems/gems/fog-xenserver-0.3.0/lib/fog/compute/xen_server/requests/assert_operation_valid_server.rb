module Fog
  module Compute
    class XenServer
      class Real
        def assert_operation_valid_server(ref, op)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.assert_operation_valid" }, ref, op)
        end

        alias_method :assert_operation_valid_vm, :assert_operation_valid_server
      end
    end
  end
end
