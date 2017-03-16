require File.expand_path("../group", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Groups < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::Group

        def all
          data = service.get_groups(href).body
          data = if data == ""
                   ""
                 else
                   data[:Groups] ? data[:Groups][:Group] : data
                 end
          if data == "" || !data.is_a?(Array) && data[:type] == "application/vnd.tmrk.cloud.layoutRow"
            nil
          else
            load(data)
          end
        end

        def get(uri)
          data = service.get_group(uri).body
          if data == ""
            nil
          else
            new(data)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
