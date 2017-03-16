module Fog
  module Compute
    class XenServer
      class Real
        def send_test_post_pool(host, port, body)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.send_test_post" }, host, port, body)
        end
      end
    end
  end
end
