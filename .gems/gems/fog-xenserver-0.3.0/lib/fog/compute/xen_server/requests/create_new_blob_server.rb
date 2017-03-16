module Fog
  module Compute
    class XenServer
      class Real
        def create_new_blob_server(ref, name, mime_type, public)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.create_new_blob" }, ref, name, mime_type, public)
        end

        alias_method :create_new_blob_vm, :create_new_blob_server
      end
    end
  end
end
