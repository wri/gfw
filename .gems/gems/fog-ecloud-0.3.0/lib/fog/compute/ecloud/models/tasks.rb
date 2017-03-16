require File.expand_path("../task", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Tasks < Fog::Ecloud::Collection
        model Fog::Compute::Ecloud::Task

        identity :href
        attribute :other_links, :aliases => :Links
        attribute :total_count, :aliases => :TotalCount

        def all
          data = service.get_tasks(href).body
          data = data[:Task] ? data[:Task] : data
          load(data)
        end

        def get(uri)
          if data = service.get_task(uri)
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
