module Fog
  module Compute
    class Vsphere
      class Clusters < Fog::Collection
        autoload :Cluster, File.expand_path('../cluster', __FILE__)

        model Fog::Compute::Vsphere::Cluster
        attr_accessor :datacenter

        def all(filters = {})
          requires :datacenter
          load service.list_clusters(filters.merge(:datacenter => datacenter))
        end

        def get(id)
          requires :datacenter
          new service.get_cluster(id, datacenter)
        end
      end
    end
  end
end
