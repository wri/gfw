Shindo.tests('Fog::Compute[:vsphere] | list_datastores request', ['vsphere']) do

  compute = Fog::Compute[:vsphere]

  tests('The response with datastore filter should') do
    response = compute.list_datastores(:datacenter => 'Solutions')
    test('be a kind of Array') { response.kind_of? Array }
    test('contain Hashes') { response.all? { |i| Hash === i } }
    test("have 2 elements") {response.length == 2}
  end

  tests('The response with cluster filter should') do
    response = compute.list_datastores(:datacenter => 'Solutions', :cluster => 'Solutionscluster')
    test('be a kind of Array') { response.kind_of? Array }
    test('contain Hashes') { response.all? { |i| Hash === i } }
    test("have a single element") {response.length == 1}
  end
end
