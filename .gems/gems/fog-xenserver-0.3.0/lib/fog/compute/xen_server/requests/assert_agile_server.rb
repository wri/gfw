module Fog
  module Compute
    class XenServer
      class Real
        def assert_agile_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.assert_agile" }, ref)
        end

        alias_method :assert_agile_vm, :assert_agile_server
      end
    end
  end
end
