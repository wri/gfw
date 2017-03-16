module Fog
  module Compute
    class XenServer
      class Real
        def call_plugin_host(ref, plugin, fn, args)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.call_plugin" }, ref, plugin, fn, args)
        end
      end
    end
  end
end
