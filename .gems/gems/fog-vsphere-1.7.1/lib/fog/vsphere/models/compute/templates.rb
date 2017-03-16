module Fog
  module Compute
    class Vsphere
      class Templates < Fog::Collection
        autoload :Template, File.expand_path('../template', __FILE__)

        model Fog::Compute::Vsphere::Template

        def all(filters = {})
          load service.list_templates(filters)
        end

        def get(id)
          new service.get_template(id)
        end
      end
    end
  end
end
