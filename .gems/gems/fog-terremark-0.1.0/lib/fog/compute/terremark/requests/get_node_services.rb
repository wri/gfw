module Fog
  module Compute
    class Terremark
      class Real
        # Get a list of all internet services for a vdc
        #
        # ==== Parameters
        # * service_id<~Integer> - Id of internet service that we want a list of nodes for
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:

        #
        def get_node_services(service_id)
          request(
            :expects  => 200,
            :method   => "GET",
            :parser   => Fog::Parsers::Terremark::GetNodeServices.new,
            :path     => "api/extensions/v1.6/internetService/#{service_id}/nodeServices",
            :override_path => true
          )
        end
      end
    end
  end
end
