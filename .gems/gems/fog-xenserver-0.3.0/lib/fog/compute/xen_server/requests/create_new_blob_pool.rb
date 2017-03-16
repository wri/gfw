module Fog
  module Compute
    class XenServer
      class Real
        def create_new_blob_pool(ref, name, mime_type, public)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.create_new_blob" }, ref, name, mime_type, public)
        end
      end
    end
  end
end
