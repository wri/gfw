Shindo.tests('Fog::Compute[:vsphere] | modify_vm_cdrom request', ['vsphere']) do

  compute = Fog::Compute[:vsphere]

  modify_target = '5032c8a5-9c5e-ba7a-3804-832a03e16381'
  modify_cdrom = compute.cdroms.new(
    instance_uuid: modify_target,
  )

  tests('When adding a cdrom the response should') do
    response = compute.add_vm_cdrom(modify_cdrom)
    test('be a kind of Hash') { response.kind_of? Hash }
    test('should have a task_state key') { response.key? 'task_state' }
  end

  tests('When destroying a cdrom the response should') do
    response = compute.destroy_vm_cdrom(modify_cdrom)
    test('be a kind of Hash') { response.kind_of? Hash }
    test('should have a task_state key') { response.key? 'task_state' }
  end
end
