module Fog
  module Compute
    class Vsphere
      class Datacenters < Fog::Collection
        autoload :Datacenter, File.expand_path('../datacenter', __FILE__)

        model Fog::Compute::Vsphere::Datacenter

        def all(filters = {})
          load service.list_datacenters(filters)
        end

        def get(name)
          new service.get_datacenter(name)
        end
      end
    end
  end
end
