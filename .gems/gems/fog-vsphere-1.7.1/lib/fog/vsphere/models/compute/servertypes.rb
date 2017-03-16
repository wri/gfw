module Fog
  module Compute
    class Vsphere
      class Servertypes < Fog::Collection
        autoload :Servertype, File.expand_path('../servertype', __FILE__)

        model Fog::Compute::Vsphere::Servertype
        attr_accessor :datacenter, :id, :fullname

        def all(filters = { })
          load service.list_server_types(filters.merge({:datacenter => datacenter}))
        end

        def get(id)
          requires :datacenter
          new service.get_server_type(id, datacenter)
        rescue Fog::Compute::Vsphere::NotFound
          nil
        end
      end
    end
  end
end
