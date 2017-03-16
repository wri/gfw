module Fog
  module Compute
    class XenServer
      class Real
        def assert_can_be_recovered_server(ref, session_to)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.assert_can_be_recovered" }, ref, session_to)
        end

        alias_method :assert_can_be_recovered_vm, :assert_can_be_recovered_server
      end
    end
  end
end
