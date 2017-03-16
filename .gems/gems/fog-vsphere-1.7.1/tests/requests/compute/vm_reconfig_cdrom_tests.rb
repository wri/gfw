Shindo.tests('Fog::Compute[:vsphere] | vm_reconfig_cdrom request', ['vsphere']) do

  compute = Fog::Compute[:vsphere]

  reconfig_target = '5032c8a5-9c5e-ba7a-3804-832a03e16381'
  reconfig_spec = {
    'start_connected' => false,
  }

  tests('the response should') do
    response = compute.vm_reconfig_cdrom('instance_uuid' => reconfig_target, 'hardware_spec' => reconfig_spec)
    test('be a kind of Hash') { response.kind_of? Hash }
    test('should have a task_state key') { response.key? 'task_state' }
  end
end
