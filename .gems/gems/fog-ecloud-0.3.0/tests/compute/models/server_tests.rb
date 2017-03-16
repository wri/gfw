provider, config = :ecloud, compute_providers[:ecloud]

Shindo.tests("Fog::Compute[:#{provider}] | server", [provider.to_s, "attributes"]) do
  connection   = Fog::Compute[provider]
  connection.base_path = '/cloudapi/spec'
  organization = connection.organizations.first
  environment  = organization.environments.find{|e| e.name == config[:server_attributes][:environment_name]} || organization.environments.first
  public_ip    = environment.public_ips.first
  compute_pool = environment.compute_pools.first
  image_href   = Fog.credentials[:ecloud_image_href] || compute_pool.templates.first.href
  ssh_key      = organization.admin.ssh_keys.find { |key| key.name == "root" }

  @network = environment.networks.first
  options = config[:server_attributes].merge(:network_uri => @network.href, :ssh_key_uri => ssh_key.href)
  #if Fog.credentials[:ecloud_ssh_key_id]
  #  options = options.merge(:ssh_key_uri => "/cloudapi/ecloud/admin/sshkeys/#{Fog.credentials[:ecloud_ssh_key_id]}")
  #end

  @server = compute_pool.servers.first || compute_pool.servers.create(image_href, options).tap{|s| s.wait_for { ready? }}

  tests('#ip_addresses').succeeds do
    returns(true, "is an array") { @server.ips.is_a?(Array) }
    returns(true, "contains an VirtualMachineAssignedIp") { @server.ips.all?{|ip| ip.is_a?(Fog::Compute::Ecloud::VirtualMachineAssignedIp) } }
  end
end
