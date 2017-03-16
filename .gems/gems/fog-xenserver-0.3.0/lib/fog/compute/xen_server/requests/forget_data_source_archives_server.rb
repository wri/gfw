module Fog
  module Compute
    class XenServer
      class Real
        def forget_data_source_archives_server(ref, data_source)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.forget_data_source_archives" }, ref, data_source)
        end

        alias_method :forget_data_source_archives_vm, :forget_data_source_archives_server
      end
    end
  end
end
