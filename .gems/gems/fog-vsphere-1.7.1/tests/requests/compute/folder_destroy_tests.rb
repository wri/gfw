Shindo.tests('Fog::Compute[:vsphere] | folder_destroy request', ['vsphere']) do

  compute = Fog::Compute[:vsphere]

  empty_folder = "/Solutions/empty"
  full_folder  = "/Solutions/wibble"
  datacenter   = "Solutions"

  tests('The response should') do
    response = compute.folder_destroy(empty_folder, datacenter)
    test('be a kind of Hash') { response.kind_of? Hash }
    test('should have a task_state key') { response.key? 'task_state' }
  end
  
  tests('When folder is not empty') do
    raises(Fog::Vsphere::Errors::ServiceError, 'raises ServiceError') do
      compute.folder_destroy(full_folder, datacenter)
    end
  end

end
