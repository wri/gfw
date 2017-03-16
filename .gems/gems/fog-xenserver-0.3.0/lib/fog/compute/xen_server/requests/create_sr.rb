module Fog
  module Compute
    class XenServer
      class Real
        def create_sr(config = {}, extra_params = {})
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.create" },
                              extra_params[:host_ref], extra_params[:device_config], config[:physical_size],
                              config[:name], config[:description], config[:type], config[:content_type],
                              config[:shared], config[:sm_config])
        end
      end
    end
  end
end