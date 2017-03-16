require File.expand_path("../row", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Rows < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::Row

        def all
          data = service.get_layout(href).body[:Rows][:Row]
          load(data)
        end

        def get(uri)
          data = service.get_row(uri).body
          if data == ""
            nil
          else
            new(data)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end

        def create(options = {})
          options[:uri] = "#{service.base_path}/layoutRows/environments/#{environment_id}/action/createLayoutRow"
          data = service.rows_create(options).body
          new(data)
        end

        def environment_id
          href.scan(/\d+/)[0]
        end
      end
    end
  end
end
