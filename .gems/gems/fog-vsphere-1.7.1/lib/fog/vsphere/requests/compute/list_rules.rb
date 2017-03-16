module Fog
  module Compute
    class Vsphere
      class Real
        def list_rules(filters = {})
          cluster = get_raw_cluster(filters[:cluster], filters[:datacenter])
          cluster.configurationEx.rule.map {|r| rule_attributes r, filters}
        end

        protected

        def rule_attributes(rule, filters)
          attributes = {}
          attributes[:datacenter] = filters[:datacenter]
          attributes[:cluster] = filters[:cluster]
          attributes[:key] = rule[:key]
          attributes[:name] = rule[:name]
          attributes[:enabled] = rule[:enabled]
          attributes[:type] = rule.class
          if rule.class.to_s == 'ClusterAntiAffinityRuleSpec' || rule.class.to_s == 'ClusterAffinityRuleSpec'
            attributes[:vm_ids] = rule[:vm].map {|vm| vm.config.instanceUuid}
          elsif rule.class.to_s == 'ClusterVmHostRuleInfo'
            attributes[:mandatory] = rule[:mandatory]
            attributes[:vmGroupName] = rule[:vmGroupName]
            attributes[:affineHostGroupName] = rule[:affineHostGroupName]
          end
          return attributes
        end
      end
      class Mock
        def list_rules(filters = {})
          self.data[:rules].values.select {|r| r[:datacenter] == filters[:datacenter] && r[:cluster] == filters[:cluster]}
        end
      end
    end
  end
end
