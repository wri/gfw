require File.expand_path("../network", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Networks < Fog::Ecloud::Collection
        attribute :href, :aliases => :Href

        model Fog::Compute::Ecloud::Network

        def all
          body = service.get_networks(href).body
          body = body[:Networks] ? body[:Networks][:Network] : body[:Network]
          data = case body
                 when NilClass then []
                 when Array then body
                 when Hash then [body]
                 end
          load(data)
        end

        def get(uri)
          if data = service.get_network(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
