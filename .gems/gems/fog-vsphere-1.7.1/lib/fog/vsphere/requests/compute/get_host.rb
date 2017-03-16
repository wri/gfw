module Fog
  module Compute
    class Vsphere
      class Real

        def get_host(name, cluster_name, datacenter_name)
          get_raw_host(name, cluster_name, datacenter_name)
        end

        protected

        def get_raw_host(name, cluster_name, datacenter_name)
          cluster = get_raw_cluster(cluster_name, datacenter_name)
          cluster.host.find { |host| host.name == name } or
                        raise Fog::Compute::Vsphere::NotFound, "no such host #{name}"
        end
      end
    end
  end
end
