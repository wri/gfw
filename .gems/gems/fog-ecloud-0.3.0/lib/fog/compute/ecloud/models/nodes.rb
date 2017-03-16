require File.expand_path("../node", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Nodes < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::Node

        def all
          data = service.get_nodes(href).body
          if data[:NodeServices]
            load(data[:NodeServices][:NodeService])
          else
            load([])
          end
        end

        def get(uri)
          data = service.get_node(uri).body
          new(data)
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end

        def create(options)
          options[:uri] = "#{service.base_path}/nodeServices/internetServices/#{internet_service_id}/action/createNodeService"
          options[:protocol] ||= "TCP"
          options[:enabled] ||= true
          options[:description] ||= ""
          data = service.node_service_create(options).body
          new(data)
        end

        def internet_service_id
          href.scan(/\d+/)[0]
        end
      end
    end
  end
end
