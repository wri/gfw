module Fog
  module Compute
    class XenServer
      class Real
        def create_new_blob_network(ref, name, mime_type, public)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "network.create_new_blob" }, ref, name, mime_type, public)
        end
      end
    end
  end
end
