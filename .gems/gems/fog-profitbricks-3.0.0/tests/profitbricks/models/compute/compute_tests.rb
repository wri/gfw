Shindo.tests('Fog::Compute[:profitbricks] | compute models', %w(profitbricks compute)) do
  compute = Fog::Compute[:profitbricks]

  tests('success') do
    Excon.defaults[:connection_timeout] = 500

    tests('should create a datacenter').succeeds do
      datacenter = compute.datacenters.create(:name => 'fog-demo',
                                              :location => 'de/fra',
                                              :description => 'testing fog rest implementation')
      datacenter.wait_for { ready? }

      @datacenter_id = datacenter.id

      datacenter.name == 'fog-demo'
      datacenter.location == 'de/fra'
      datacenter.description == 'testing fog rest implementation'
    end

    tests('should retrieve a datacenter by id').succeeds do
      datacenter = compute.datacenters.get(@datacenter_id)

      datacenter.name == 'fog-demo'
      datacenter.location == 'de/fra'
      datacenter.description == 'testing fog rest implementation'
    end

    tests('should update a datacenter').succeeds do
      datacenter = compute.datacenters.get(@datacenter_id)
      datacenter.name = datacenter.name + ' - updated'
      datacenter.description = datacenter.description + ' - updated'
      datacenter.update

      datacenter.wait_for { ready? }

      datacenter.name == 'fog-demo - updated'
      datacenter.description == 'testing fog rest implementation - updated'
    end

    tests('should retrieve all datacenters').succeeds do
      datacenters = compute.datacenters.all

      !datacenters.empty?
    end

    tests('should retrieve all locations').succeeds do
      locations = compute.locations.all

      !locations.empty?
    end

    tests('should retrieve a location by id').succeeds do
      location = compute.locations.get('us/las')

      location.name == 'lasvegas'
    end

    tests('should create a volume').succeeds do
      volume = compute.volumes.create(:datacenter_id => @datacenter_id,
                                      :name => 'fog-demo-volume',
                                      :size => 5,
                                      :licence_type => 'OTHER',
                                      :type => 'HDD',
                                      :availability_zone => 'AUTO')
      volume.wait_for { ready? }

      @volume_id = volume.id

      volume.name     == 'fog-demo-volume'
      volume.size     == 5
      volume.type     == 'HDD'
      volume.licence_type == 'OTHER'
    end

    tests('should retrieve a volume by id').succeeds do
      volume = compute.volumes.get(@datacenter_id, @volume_id)

      volume.name     == 'fog-demo-volume'
      volume.size     == 5
      volume.type     == 'HDD'
      volume.licence_type == 'OTHER'
    end

    tests('should update a volume').succeeds do
      volume = compute.volumes.get(@datacenter_id, @volume_id)
      volume.name = volume.name + ' - updated'
      volume.update

      volume.wait_for { ready? }

      volume.name == 'fog-demo-volume - updated'
    end

    tests('should retrieve all volumes').succeeds do
      volumes = compute.volumes.all(@datacenter_id)

      !volumes.empty?
    end

    tests('should create a volume snapshot').succeeds do
      volume = compute.volumes.get(@datacenter_id, @volume_id)

      volume.create_snapshot('fog-demo-snapshot', 'part of fog models test suite') == true
      volume.reload
    end

    tests('should retrieve all snapshots').succeeds do
      sleep(60) if ENV["FOG_MOCK"] != "true"

      snapshots = compute.snapshots.all

      !snapshots.empty?

      snapshot = snapshots.find do |snp|
        snp.name == 'fog-demo-snapshot'
      end

      @snapshot_id = snapshot.id
    end

    tests('should retrieve a snapshot by id').succeeds do
      snapshot = compute.snapshots.get(@snapshot_id)

      snapshot.name == 'fog-demo-snapshot'
    end

    tests('should update a snapshot').succeeds do
      snapshot = compute.snapshots.get(@snapshot_id)

      snapshot.name = snapshot.name + ' - updated'
      snapshot.update

      snapshot.name == 'fog-demo-snapshot - updated'
    end

    tests('should restore a volume snapshot').succeeds do
      volume = compute.volumes.get(@datacenter_id, @volume_id)

      volume.restore_snapshot(@snapshot_id) == true
    end

    tests('should retrieve all images').succeeds do
      images = compute.images.all

      !images.empty?

      image = images.find do |img|
        img.image_type == 'CDROM' &&
          img.licence_type == 'LINUX'
      end

      @image_id = image.id
    end

    tests('should retrieve an image by id').succeeds do
      image = compute.images.get(@image_id)

      image.image_type   == 'CDROM'
      image.licence_type == 'LINUX'
    end

    if ENV["FOG_MOCK"] == "true"
      tests('should update an image').succeeds do
        image = compute.images.get(@image_id)
        image.licence_type = 'UNKNOWN'
        image.update

        image.licence_type == 'UNKNOWN'
      end
    end

    tests('should create a server').succeeds do
      server = compute.servers.create(:datacenter_id => @datacenter_id,
                                      :name => 'fog-demo-server',
                                      :cores => 2,
                                      :ram => 2048,
                                      :licenceType => 'OTHER')
      server.wait_for { ready? }

      @server_id = server.id

      server.name  == 'fog-demo-server'
      server.cores == 2
      server.ram   == 2048
    end

    tests('should retrieve a server by id').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.name  == 'fog-demo-server'
      server.cores == 2
      server.ram   == 2048
    end

    tests('should retrieve all servers').succeeds do
      servers = compute.servers.all(@datacenter_id)

      !servers.empty?
    end

    tests('should update a server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.name = server.name + ' - updated'
      server.update

      server.wait_for { ready? }

      server.name == 'fog-demo-server - updated'
    end

    tests('should attach a volume to the server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      volume = server.attach_volume(@volume_id)

      sleep(60) if ENV["FOG_MOCK"] != "true"

      volume['id'] == @volume_id
    end

    tests('should retrieve all attached volumes').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      volumes = server.list_volumes
    end

    tests('should retrieve an attached volume').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      volume = server.get_attached_volume(@volume_id)
    end

    tests('should detach a volume from the server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.detach_volume(@volume_id)
    end

    tests('should attach a CD-ROM to the server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      sleep(60) if ENV["FOG_MOCK"] != "true"

      cdrom = server.attach_cdrom(@image_id)

      sleep(60) if ENV["FOG_MOCK"] != "true"

      @cdrom_id = cdrom['id']
    end

    tests('should retrieve all attached CD-ROMs').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      cdroms = server.list_cdroms
    end

    if ENV["FOG_MOCK"] != "true"
      tests('should detach a CD-ROM from the server').succeeds do
        server = compute.servers.get(@datacenter_id, @server_id)

        if !server.list_cdroms['items'].empty?
          server.detach_cdrom(@image_id)
        else
          server.list_cdroms
        end
      end
    end

    tests('should reboot a server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.reboot
    end

    tests('should stop a server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.stop
    end

    tests('should start a server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.stop
    end

    tests('should create a lan').succeeds do
      lan = compute.lans.create(:datacenter_id => @datacenter_id,
                                :name => 'fog-demo-lan',
                                :public => false)

      @lan_id = lan.id

      lan.name == 'fog-demo-lan'
    end

    tests('should retrieve all lans').succeeds do
      sleep(60) if ENV["FOG_MOCK"] != "true"

      lans = compute.lans.all(@datacenter_id)
    end

    tests('should retrieve a lan by id').succeeds do
      lan = compute.lans.get(@datacenter_id, @lan_id)

      lan.name == 'fog-demo-lan'
    end

    tests('should update a lan').succeeds do
      lan = compute.lans.get(@datacenter_id, @lan_id)
      lan.name == lan.name + ' - updated'
      lan.update
    end

    tests('should create a NIC').succeeds do
      nic = compute.nics.create(:datacenter_id => @datacenter_id,
                                :server_id     => @server_id,
                                :lan           => @lan_id,
                                :name          => 'fog-demo-nic',
                                :nat           => false)

      @nic_id = nic.id

      nic.name == 'fog-demo-nic'
    end

    tests('should retrieve all NICs').succeeds do
      sleep(60) if ENV["FOG_MOCK"] != "true"

      nics = compute.nics.all(@datacenter_id, @server_id)
    end

    tests('should retrieve a NIC by id').succeeds do
      nic = compute.nics.get(@datacenter_id, @server_id, @nic_id)

      nic.name == 'fog-demo-nic'
    end

    tests('should update a NIC').succeeds do
      nic = compute.nics.get(@datacenter_id, @server_id, @nic_id)
      nic.name = nic.name + ' - updated'
      nic.update
    end

    tests('should create a load balancer').succeeds do
      load_balancer = compute.load_balancers.create(:datacenter_id => @datacenter_id,
                                                    :name          => 'fog-demo-load-balancer')

      sleep(60) if ENV["FOG_MOCK"] != "true"

      @load_balancer_id = load_balancer.id

      load_balancer.name == 'fog-demo-load-balancer'
    end

    tests('should retrieve a load balancer by id').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)

      load_balancer.name == 'fog-demo-load-balancer'
    end

    tests('should retrieve all load balancers').succeeds do
      load_balancers = compute.load_balancers.all(@datacenter_id)

      !load_balancers.empty?
    end

    tests('should update a load balancer').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)
      load_balancer.name = load_balancer.name + ' - updated'
      load_balancer.update
    end

    tests('should associate a NIC to a load balancer').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)
      nic = load_balancer.associate_nic(@nic_id)

      sleep(60) if ENV["FOG_MOCK"] != "true"

      nic
    end

    tests('should retrieve all load balanced NICs').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)

      load_balancer.list_nics
    end

    tests('should retrieve a load balanced NIC').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)
      nic = load_balancer.get_nic(@nic_id)

      nic['id'] == @nic_id
    end

    tests('should remove a NIC association from a load balancer').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)
      result = load_balancer.remove_nic_association(@nic_id)

      sleep(60) if ENV["FOG_MOCK"] != "true"

      result
    end

    tests('should update a load balancer').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)
      load_balancer.name = load_balancer.name + ' - updated'
      load_balancer.update
    end

    tests('should create an ip block').succeeds do
      ip_block = compute.ip_blocks.create(:location => 'de/fra',
                                          :size     => 1,
                                          :name     => 'fog-demo-ip-block')

      sleep(60) if ENV["FOG_MOCK"] != "true"

      @ip_block_id = ip_block.id
      ip_block.name == 'fog-demo-ip-block'
    end

    tests('should retrieve an ip block by id').succeeds do
      ip_block = compute.ip_blocks.get(@ip_block_id)

      ip_block.name == 'fog-demo-ip-block'
    end

    tests('should retrieve all ip blocks').succeeds do
      ip_blocks = compute.ip_blocks.all

      !ip_blocks.empty?
    end

    tests('should create a firewall rule').succeeds do
      firewall_rule = compute.firewall_rules.create(:datacenter_id => @datacenter_id,
                                                    :server_id => @server_id,
                                                    :nic_id => @nic_id,
                                                    :name           => 'fog-demo-firewall-rule',
                                                    :protocol       => 'TCP')

      sleep(60) if ENV["FOG_MOCK"] != "true"

      @firewall_rule_id = firewall_rule.id

      firewall_rule.name == 'fog-demo-firewall-rule'
    end

    tests('should retrieve a firewall rule').succeeds do
      firewall_rule = compute.firewall_rules.get(@datacenter_id, @server_id, @nic_id, @firewall_rule_id)

      firewall_rule.name == 'fog-demo-firewall-rule'
    end

    tests('should retrieve all firewall rules').succeeds do
      firewall_rules = compute.firewall_rules.all(@datacenter_id, @server_id, @nic_id)

      !firewall_rules.empty?
    end

    tests('should update a firewall rule').succeeds do
      firewall_rule = compute.firewall_rules.get(@datacenter_id, @server_id, @nic_id, @firewall_rule_id)
      firewall_rule.name = firewall_rule.name + ' - updated'
      firewall_rule.update
    end

    tests('should delete a firewall rule').succeeds do
      firewall_rule = compute.firewall_rules.get(@datacenter_id, @server_id, @nic_id, @firewall_rule_id)

      firewall_rule.delete
    end

    tests('should delete a NIC').succeeds do
      nic = compute.nics.get(@datacenter_id, @server_id, @nic_id)

      nic.delete
    end

    tests('should delete a lan').succeeds do
      lan = compute.lans.get(@datacenter_id, @lan_id)

      lan.delete
    end

    tests('should delete a load balancer').succeeds do
      load_balancer = compute.load_balancers.get(@datacenter_id, @load_balancer_id)

      load_balancer.delete
    end

    tests('should delete an ip block').succeeds do
      ip_block = compute.ip_blocks.get(@ip_block_id)

      ip_block.delete
    end

    tests('should delete a server').succeeds do
      server = compute.servers.get(@datacenter_id, @server_id)

      server.delete
    end

    tests('should delete a volume').succeeds do
      volume = compute.volumes.get(@datacenter_id, @volume_id)

      volume.delete
    end

    if ENV["FOG_MOCK"] == "true"
      tests('should delete an image').succeeds do
        image = compute.images.get(@image_id)

        image.delete
      end
    end

    tests('should delete a snapshot').succeeds do
      snapshot = compute.snapshots.get(@snapshot_id)

      snapshot.delete
    end

    tests('should delete a datacenter').succeeds do
      datacenter = compute.datacenters.get(@datacenter_id)

      datacenter.delete
    end
  end
end
