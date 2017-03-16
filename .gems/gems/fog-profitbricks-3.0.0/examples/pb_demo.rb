require 'fog/profitbricks'

Excon.defaults[:connection_timeout] = 200

compute = Fog::Compute.new(:provider => 'ProfitBricks')

# Find the Ubuntu 16 image in North America.
image = compute.images.all.find do |image|
  image.name =~ /Ubuntu-16/ &&
    image.location == 'us/las'
end

# Create datacenter.
datacenter = compute.datacenters.create(:name => 'fog-demo',
                                        :location => 'us/las',
                                        :description => 'fog-profitbricks demo')
datacenter.wait_for { ready? }

# Rename datacenter.
datacenter.name = 'rename fog-demo'
datacenter.update

# Create public LAN.
lan = compute.lans.create(:datacenter_id => datacenter.id,
                          :name => 'public',
                          :public => true)

# Define system volume.
system_volume = {
  :name => 'system',
  :size => 5,
  :image => image.id,
  :image_password => 'volume2016',
  :ssh_keys => ['ssh-rsa AAAAB3NzaC1yc2EAAAADA=='],
  :type => 'HDD'
}

# Define public firewall rules.
fw1 = { :name => 'Allow SSH', :protocol => 'TCP', :port_range_start => 22, :port_range_end => 22 }
fw2 = { :name => 'Allow Ping', :protocol => 'ICMP', :icmp_type => 8, :icmp_code => 0 }

# Define public network interface.
public_nic = {
  :name => 'public',
  :lan => lan.id,
  :dhcp => true,
  :firewall_active => true,
  :firewall_rules => [fw1, fw2]
}

# Create a server with the above system volume and public network interface.
server1 = compute.servers.create(:datacenter_id => datacenter.id,
                                 :name => 'server1',
                                 :cores => 1,
                                 :cpu_family => 'AMD_OPTERON',
                                 :ram => 2048,
                                 :volumes => [system_volume],
                                 :nics => [public_nic])
server1.wait_for { ready? }

# Change CPU family from AMD_OPTERON to INTEL_XEON.
server1.allow_reboot = true
server1.cpu_family = 'INTEL_XEON'
server1.update

# Create data volume.
data_volume = compute.volumes.create(:datacenter_id => datacenter.id,
                                     :name => 'data',
                                     :size => 5,
                                     :licence_type => 'OTHER',
                                     :type => 'SSD')
data_volume.wait_for { ready? }

# Attach data volume to server1.
server1.attach_volume(data_volume.id)

# Connect a second network interface to server1.
private_nic = compute.nics.create(:datacenter_id => datacenter.id,
                                  :server_id => server1.id,
                                  :name => 'private',
                                  :dhcp => true,
                                  :lan => 2)
private_nic.wait_for { ready? }

# Create a second server.
server2 = compute.servers.create(:datacenter_id => datacenter.id,
                                 :name => 'server2',
                                 :cores => 1,
                                 :cpu_family => 'AMD_OPTERON',
                                 :ram => 2048,
                                 :volumes => [system_volume])
server2.wait_for { ready? }

# Connect a private network interface to server2 with SSH access.
private_nic = compute.nics.create(:datacenter_id => datacenter.id,
                                  :server_id => server2.id,
                                  :name => 'private',
                                  :dhcp => true,
                                  :lan => 2,
                                  :firewall_rules => [fw1])
private_nic.wait_for { ready? }
