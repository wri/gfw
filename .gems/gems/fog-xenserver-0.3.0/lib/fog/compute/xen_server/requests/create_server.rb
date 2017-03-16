module Fog
  module Compute
    class XenServer
      class Real
        def create_server(config = {}, extra_params = {})
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "VM.create" }, config)
        end

        alias_method :create_vm, :create_server
      end
    end
  end
end