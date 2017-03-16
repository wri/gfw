module Fog
  module Compute
    class XenServer
      class Real
        def create_vdi(config = {}, extra_params = {})
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.create"}, config)
        end
      end
    end
  end
end