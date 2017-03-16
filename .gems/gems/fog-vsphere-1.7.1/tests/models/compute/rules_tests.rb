Shindo.tests('Fog::Compute[:vsphere] | rules collection', ['vsphere']) do
  
  compute = Fog::Compute[:vsphere]
  cluster = compute.datacenters.first.clusters.get('Solutionscluster')
  servers = compute.servers
  rules = cluster.rules
  
  tests('The rules collection') do
    test('should not be empty') { not rules.empty? }
    test('should be a kind of Fog::Compute::Vsphere::Rules') { rules.kind_of? Fog::Compute::Vsphere::Rules }
    test('should get rules') { rules.get('anti-affinity-foo').key == 4242 }
    test('should destroy rules') { rules.first.destroy; rules.reload; rules.empty? }
    test('should create rules') do
      r = rules.new({
        name: 'affinity-foo',
        enabled: true,
        type: RbVmomi::VIM::ClusterAffinityRuleSpec
      })
      r.vms = [servers.get('5032c8a5-9c5e-ba7a-3804-832a03e16381'), servers.get('502916a3-b42e-17c7-43ce-b3206e9524dc')]
      r.save
      rules.reload
      rules.get('affinity-foo').key > 0
    end
    raises(ArgumentError, 'should not create rules with <2 vms') do
      rules.create({
        name: 'affinity-foo',
        enabled: true,
        type: RbVmomi::VIM::ClusterAffinityRuleSpec,
        vm_ids: ['5032c8a5-9c5e-ba7a-3804-832a03e16381']
      })
    end
  end
  
end
