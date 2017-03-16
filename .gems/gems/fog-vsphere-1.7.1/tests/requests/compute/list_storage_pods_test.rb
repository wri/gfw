Shindo.tests('Fog::Compute[:vsphere] | list_storage_pods request', ['vsphere']) do
  tests("When listing all storage pods") do

    response = Fog::Compute[:vsphere].list_storage_pods

    tests("The response data format ...") do
      test("be a kind of Hash") { response.kind_of? Array }
    end
  end
end
