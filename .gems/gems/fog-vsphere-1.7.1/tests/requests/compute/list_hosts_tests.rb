Shindo.tests('Fog::Compute[:vsphere] | list_hosts request', ['vsphere']) do

  compute = Fog::Compute[:vsphere]

  tests('The response should') do
    response = compute.list_hosts(:datacenter => 'Solutions', :cluster => 'Solutionscluster')
    test('be a kind of Array') { response.kind_of? Array }
    test('contain Hashes') { response.all? { |i| Hash === i } }
    test("have 1 element") {response.length == 1}
  end
end
