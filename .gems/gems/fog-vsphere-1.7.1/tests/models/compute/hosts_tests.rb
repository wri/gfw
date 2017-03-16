Shindo.tests('Fog::Compute[:vsphere] | hosts collection', ['vsphere']) do

  compute = Fog::Compute[:vsphere]
  cluster = compute.datacenters.first.clusters.get('Solutionscluster')
  hosts = cluster.hosts

  tests('The hosts collection') do
    test('should not be empty') { not hosts.empty? }
    test('should be a kind of Fog::Compute::Vsphere::Hosts') { hosts.kind_of? Fog::Compute::Vsphere::Hosts }
    test('should get hosts') { hosts.get('host1.example.com').name == 'host1.example.com' }
  end

end
