module Fog
  module Compute
    class XenServer
      class Real
        def revert_to_server(snapshot_ref, extra_args = {})
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "VM.revert"}, snapshot_ref)
        end

        alias_method :revert_to_vm, :revert_to_server

        def snapshot_server(snapshot_ref, extra_args = {})
          Fog::Logger.deprecation "This method is DEPRECATED. Use #revert_to_server instead."
          revert_to_server(snapshot_ref, extra_args)
        end
      end
    end
  end
end