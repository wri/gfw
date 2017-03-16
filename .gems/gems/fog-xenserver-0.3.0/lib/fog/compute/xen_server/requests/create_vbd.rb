module Fog
  module Compute
    class XenServer
      class Real
        def create_vbd(config = {}, extra_params = {})
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.create"}, config)
        end
      end
    end
  end
end