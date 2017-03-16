module Fog
  module Compute
    class XenServer
      class Real
        def create_vlan(config = {}, extra_params = {})
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VLAN.create" },
                              extra_params[:pif_ref], config[:tag].to_s, extra_params[:network_ref])
        end
      end
    end
  end
end