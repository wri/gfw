module Fog
  module Compute
    class Vsphere
      class Real
        def list_hosts(filters = {})
          cluster = get_raw_cluster(filters[:cluster], filters[:datacenter])
          cluster.host.map {|host| host_attributes(host, filters)}
        end

        protected

        def host_attributes(host, filters)
          {
            datacenter: filters[:datacenter],
            cluster:    filters[:cluster],
            name:       host[:name],
            vm_ids:     host[:vm].map {|vm| vm.config.instanceUuid }
          }
        end
      end
      class Mock
        def list_hosts(filters = {})
          self.data[:hosts].values.select {|r| r[:datacenter] == filters[:datacenter] && r[:cluster] == filters[:cluster]}
        end
      end
    end
  end
end
