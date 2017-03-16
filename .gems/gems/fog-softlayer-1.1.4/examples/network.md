### Network Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.


#### Create a connection to SoftLayer Network

```ruby
	require 'fog/softlayer'
	@sl = Fog::Network[:softlayer]
```

#### Use the Models
1. List existing networks.

   ```ruby
    nets = @sl.networks
    # => [ <Fog::Network::Softlayer::Network
    #  	id=123456,
    #	name="some-optional-name",
    #	modify_date="2014-06-25T17:10:57-05:00",
    #	note=nil,
    #	tags=["sparkle", "motion", "public"],
    #	type="STANDARD",
    #	datacenter=	<Fog::Network::Softlayer::Datacenter
    #		id=12345,
    #		long_name="Washington, DC 1",
    #		name="wdc01"
    #		>,
    #	network_space="PUBLIC"
    #	router={"hostname"=>"fcr02.wdc01", "id"=>40378, "datacenter"=>{"id"=>37473, "longName"=>"Washington, DC 1", "name"=>"wdc01"}}
    #	>,
    #	<Fog::Network::Softlayer::Network
    #	id=123457,
    #	name="some-other-optional-name",
    #	modify_date="2014-06-25T17:11:57-05:00",
    #	note=nil,
    #	tags=["sparkle", "motion", "private"],
    #	type="STANDARD",
    #	datacenter=	<Fog::Network::Softlayer::Datacenter
    #		id=12345,
    #		long_name="Washington, DC 1",
    #		name="wdc01"
    #		>,
    #	network_space="PRIVATE"
    #	router={"hostname"=>"bcr02.wdc01", "id"=>40379, "datacenter"=>{"id"=>37473, "longName"=>"Washington, DC 1", "name"=>"wdc01"}}
    #	>,    	  	
	# ]
   ```
   
1. Get a network by ID.

	```ruby
	net = @sl.networks.get(123456)
	# => <Fog::Network::Softlayer::Network
    #	id=123456,
    #	name="some-name",
    #	modify_date="2014-06-25T17:10:57-05:00",
    #	note=nil,
    #	tags=["sparkle", "motion", "public"],
    #	type="STANDARD",
    #	datacenter=	<Fog::Network::Softlayer::Datacenter
    #		id=12345,
    #		long_name="Washington, DC 1",
    #		name="wdc01"
    #		>,
    #	network_space="PUBLIC"
    #	router={"hostname"=>"fcr02.wdc01", "id"=>40378, "datacenter"=>{"id"=>37473, "longName"=>"Washington, DC 1", "name"=>"wdc01"}}
    #	>
	```
	
1. Get a network by name.

	```ruby
	@sl.networks.by_name('some-name')
	# => <Fog::Network::Softlayer::Network
    #	id=123456,
    #	name="some-name",
    #	modify_date="2014-06-25T17:10:57-05:00",
    #	note=nil,
    #	tags=["sparkle", "motion", "public"],
    #	type="STANDARD",
    #	datacenter=	<Fog::Network::Softlayer::Datacenter
    #		id=12345,
    #		long_name="Washington, DC 1",
    #		name="wdc01"
    #		>,
    #	network_space="PUBLIC"
    #	router={"hostname"=>"fcr02.wdc01", "id"=>40378, "datacenter"=>{"id"=>37473, "longName"=>"Washington, DC 1", "name"=>"wdc01"}}
    #	>
	```
	
1. Get all networks with a particular tag.

	```ruby
	prod_backend_nets = @sl.networks.tagged_with(['production', 'private'])
	# => [<Fog::Network::Softlayer::Network>,
	#	<Fog::Network::Softlayer::Network>,
	#	<Fog::Network::Softlayer::Network>,
	#	]    	
	```
	
1. Get a network's tags.

	```ruby
		net = @sl.networks.get(123456)
    	net.tags
    	# => ['sparkle', 'motion', 'production', 'public']
	```
	
1. Get a network's router.

	```ruby
		net = @sl.networks.by_name('some-name')
		net.router
		# => {"hostname"=>"bcr02a.ams01",
		# "id"=>190854,
		# "datacenter"=>{"id"=>265592, "longName"=>"Amsterdam 1", "name"=>"ams01"}}
	```

1. Get a network's subnets.

	```ruby
		net = @sl.networks.get(123456)
		net.subnets
		# => [  <Fog::Network::Softlayer::Subnet
	    # id=123456,
	    # name=nil,
	    # network_id="37.58.125.72",
	    # vlan_id=123456,
	    # cidr=29,
	    # ip_version=4,
	    # type="ADDITIONAL_PRIMARY",
	    # gateway_ip="37.58.125.73",
	    # broadcast="37.58.125.79",
	    # gateway=nil,
    	# datacenter="ams01"
	  # >,
	   # <Fog::Network::Softlayer::Subnet
	    # id=123457,
    	# name=nil,
	    # network_id="81.95.147.148",
    	# vlan_id=123456,
	    # cidr=30,
	    # ip_version=4,
    	# type="PRIMARY",
	    # gateway_ip="81.95.147.149",
	    # broadcast="81.95.147.151",
	    # gateway=nil,
	    # datacenter="ams01"
	  # >]
	```
	
1. Get a subnet's IP Addresses.

	```ruby
		net = @sl.networks.get(123456)
		# Here I'm selecting the primary subnet...
		subnet = net.subnets.select { |vlan| vlan.type == "PRIMARY" }.first
		# => <Fog::Network::Softlayer::Subnet
	    # id=123457,
	    # ...
	    # >
	    addys = subnet.addresses
	    # => [  <Fog::Network::Softlayer::Ip
   		 # id=19222174,
	     # subnet_id=630962,
	     # address="37.58.125.72",
	     # broadcast=false,
	     # gateway=false,
	     # network=true,
	     # reserved=false,
	     # note=nil,
	     # assigned_to=nil
		 # >,
		# <Fog::Network::Softlayer::Ip
   		 #  id=19222174,
		 #  subnet_id=630962,
		 #  address="37.58.125.73",
		 #  broadcast=false,
		 #  gateway=true,
		 #  network=false,
		 #  reserved=false,
		 #  note=nil,
		 #  assigned_to=nil
		 #  >,
		# <Fog::Network::Softlayer::Ip
   		 #  id=19222174,
		 #  subnet_id=630962,
		 #  address="37.58.125.74",
		 #  broadcast=false,
		 #  gateway=false,
		 #  network=false,
		 #  reserved=false,
		 #  note=nil,
		 #  assigned_to={"fullyQualifiedDomainName"=>"hostname.example.com", "id"=>281730}
		 #  >,
		# <Fog::Network::Softlayer::Ip
   		 #  id=19222174,
		 #  subnet_id=630962,
		 #  address="37.58.125.75",
		 #  broadcast=false,
		 #  gateway=false,
		 #  network=false,
		 #  reserved=false,
		 #  note=nil,
		 #  assigned_to={"fullyQualifiedDomainName"=>"hostname-2.example.com", "id"=>281730}
		 #  >,
		# ...,
	   #  ]	    
	```
	
1. Create a new network.

	```ruby
		# We're creating a network in wdc01, the same steps will work for any datacenter.
		# @sl.datacenters will give you a list of available datacenters.
		
		wdc01 = @sl.datacenters.by_name('wdc01')
		wdc01.routers
		# => [{"hostname"=>"bcr01.wdc01", "id"=>16358},
		# {"hostname"=>"bcr02.wdc01", "id"=>40379},
		# {"hostname"=>"bcr03a.wdc01", "id"=>85816},
		# {"hostname"=>"bcr04a.wdc01", "id"=>180611},
		# {"hostname"=>"bcr05a.wdc01", "id"=>235754},
		# {"hostname"=>"fcr01.wdc01", "id"=>16357},
		# {"hostname"=>"fcr02.wdc01", "id"=>40378},
		# {"hostname"=>"fcr03a.wdc01", "id"=>85814},
		# {"hostname"=>"fcr04a.wdc01", "id"=>180610},
		# {"hostname"=>"fcr05a.wdc01", "id"=>235748}]
		 
		# We want to create a public network so be sure to use one of the fcr* routers.
		# If we were creating a private network we'd want to use a bcr* router.
		
		opts = {
		 :name => 'my-new-network', 
		 :datacenter => wdc01,
		 :router => wdc01.routers[4],
		 :network_space => 'PUBLIC',
		}
		
		@sl.networks.create(opts)		
	```
	
1. Add tags to a network.

	```ruby
		net = @sl.networks.by_name('my-new-network')
		net.tags
		# => ['sparkle']
		net.add_tags(['motion'])
		# => true
		net.tags
		# => ['sparkle', 'motion']
	```
	
1. Delete tags from a network.

	```ruby
		net = @sl.networks.by_name('my-new-network')
		net.tags
		# => ['sparkle', 'motion']
		net.delete_tags(['motion'])
		# => true
		net.tags
		# => ['sparkle']
	```

1. Delete a network.

	```ruby
		@sl.networks.by_name('my-retired-network').destroy
		# => true
		
		# You can't delete a network if it has actively routed addresses...
	```
	
1. Get a datacenter maintenance windows.

	```ruby
	dc = @sl.datacenters.by_name('YOUR_DATACENTER')
	dc.get_maintenance_windows(begin_date, end_date, slots_number) # dates need be a Datetime
	```
