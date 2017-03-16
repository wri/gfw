### Compute Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.

  
#### Create a connection to SoftLayer Compute Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::Compute[:softlayer]
```

#### Use the Models
1. List all servers

   ```ruby
   @sl.servers # list all servers
   @sl.servers.size # get a count of all servers 
   ```

1. Get a server's details

   ```ruby
   server = @sl.servers.get(<server id>)
   server.name # => 'hostname.example.com'
   server.created_at # => DateTime the server was created
   server.state # => 'Running', 'Stopped', 'Terminated', etc.
   ```

1. Get a server's details using ip address

   ```ruby
   server = @sl.servers.get_by_ip(<server ip>)
   server.name # => 'hostname.example.com'
   server.created_at # => DateTime the server was created
   server.state # => 'Running', 'Stopped', 'Terminated', etc.
   ```

1. Get all servers tagged with certain tags.

	```ruby
	prod_fe_servers = @sl.servers.tagged_with(['production', 'frontend'])
	# => [ <Fog::Compute::Softlayer::Server>,
	#	<Fog::Compute::Softlayer::Server>,
	#	<Fog::Compute::Softlayer::Server>,
	#	<Fog::Compute::Softlayer::Server>,
	#	<Fog::Compute::Softlayer::Server>,]		
	```
   
1. Get a server's public/frontend VLAN

	```ruby
	server = @sl.servers.get(12345)
	server.vlan
	# => <Fog::Network::Softlayer::Network
    #	id=123456,
	#   name='frontend-staging-vlan',
	#   modify_date="2014-02-22T12:42:31-06:00",
	#   note=nil,
	#   tags=['sparkle', 'motion'],
	#   type="STANDARD",
	#   datacenter=    <Fog::Network::Softlayer::Datacenter
	#     id=168642,
	#     long_name="San Jose 1",
	#     name="sjc01"
	#   >,
	#   network_space="PUBLIC",
	#   router={"hostname"=>"fcr01a.sjc01", "id"=>82412, "datacenter"=>{"id"=>168642, "longName"=>"San Jose 1", "name"=>"sjc01"}}
  	# >
	```
	
1. Get a server's private/backend VLAN

	```ruby
	server = @sl.servers.get(12345)
	server.private_vlan
	# =>  <Fog::Network::Softlayer::Network
	#    id=123456,
	#    name='backend-staging-vlan',
	#    modify_date="2014-02-22T12:42:33-06:00",
	#    note=nil,
	#    tags=[],
	#    type="STANDARD",
	#    datacenter=    <Fog::Network::Softlayer::Datacenter
	#	    id=168642,
	#    	long_name="San Jose 1",
	#    	name="sjc01"
	#   >,
	#   network_space="PRIVATE",
    #	router={"hostname"=>"bcr01a.sjc01", "id"=>82461, "datacenter"=>{"id"=>168642, "longName"=>"San Jose 1", "name"=>"sjc01"}}
  	# >
	
	```
	
1. Get a server's tags

	```ruby
		server = @sl.servers.get(12345)
		server.tags
		# => ['production', 'frontend']
	```
	
1. Add tags to a server

	```ruby
		server = @sl.servers.get(12345)
		server.tags
		# => ['production', 'frontend']
		server.add_tags(['sparkle', 'motion']
		# => true
		server.tags
		# => ['production', 'frontend', 'sparkle', 'motion']
	```

1. Delete tags from a server

	```ruby
		server = @sl.servers.get(12345)
		server.tags
		# => ['production', 'frontend', 'sparkle', 'motion']
		server.delete_tags(['sparkle', 'motion']
		# => true
		server.tags
		# => ['production', 'frontend']
	```

1. Provision a new VM with flavor (simple).

   ```ruby
     opts = {
     	:flavor_id => "m1.small",
     	:image_id => "23f7f05f-3657-4330-8772-329ed2e816bc",
     	:name => "test",
     	:datacenter => "ams01"
     }
     new_server = @sl.servers.create(opts)
     new_server.id # => 1337
   ```

1. Provision a new Bare Metal instance with flavor (simple).

   ```ruby
     opts = {
     	:flavor_id => "m1.medium",
     	:os_code => "UBUNTU_LATEST",
     	:name => "test1",
     	:datacenter => "ams01",
     	:bare_metal => true
     }
     @sl.servers.create(opts)
     new_server.id # => 1338
   ```
   
1. Provision a *preset* Bare Metal instance (instant provisioning).
    1. First get a list of available preset configuration keys:

        ```ruby
          @sl.get_bare_metal_create_options.body["fixedConfigurationPresets"].each {|item| puts item["preset"]};nil
        
        ``` 

    ```ruby
        opts = {  
            :domain => 'example.com',  
            :name => 'my-test',  
            :fixed_configuration_preset => '50_128GB_4X800GBSSD_RAID10',
            :os_code => 'UBUNTU_LATEST',  
            :datacenter => 'wdc01'
        }
        new_server = @sl.servers.create(opts)
        new_server.id # => 0
        new_server.wait_for_id do |details|
          puts details.inspect
        end
     new_server.id # => 1234
    ```

1. Provision a new VM without flavor.

   ```ruby
   	opts = {
     	:cpu => 2,
     	:ram => 2048,     	
     	:disk => [{'device' => 0, 'diskImage' => {'capacity' => 100 } }],
     	:ephemeral_storage => true,
     	:domain => "not-my-default.com",
     	:name => "hostname",
     	:os_code => "UBUNTU_LATEST",
     	:name => "test2",
     	:datacenter => "ams01"     
     }
   ```

1. Provision a Bare Metal Instance without a flavor

   ```ruby
   opts = {
     	:cpu => 8,
     	:ram => 16348,     	
     	:disk => {'capacity' => 500 },
     	:ephemeral_storage => true,
     	:domain => "not-my-default.com",
     	:name => "hostname",
     	:os_code => "UBUNTU_LATEST",
     	:name => "test2",
     	:datacenter => "ams01",
     	:bare_metal => true
     }
   ```

1. Create a server with one or more key pairs (also see [key_pairs.md](./key_pairs.md) )

	```ruby
	the_first_key = @sl.key_pairs.by_label('my-new-key')
	# => <Fog::Compute::Softlayer::KeyPair>
	the_second_key = @sl.key_pairs.by_label('my-other-new-key')
	# => <Fog::Compute::Softlayer::KeyPair>
	
	opts = { 
		:flavor_id => 'm1.small', 
		:os_code => 'UBUNTU_LATEST', 
		:datacenter => 'hkg02', 
		:name => 'cphrmky', 
		:key_pairs => [ the_first_key, the_second_key ]
	}
	@sl.servers.create(opts)
	# => <Fog::Compute::Softlayer::Server>
```


1. Delete a VM or Bare Metal instance.

   ```ruby
   	  @sl.servers.get(<server id>).destroy
   ```
   
1. Provision a Server (works the same for VM and Bare Metal) into a specific VLAN

	```ruby
	# I want to launch another server to hold docker containers into my existing staging VLANs
	# I'll start by getting a staging server so I can use its vlans as a reference.
	staging_server = @sl.servers.tagged_with(['staging', 'docker']).first # => <Fog::Compute::Softlayer::Server>
	
	opts = {
	  :flavor_id => 'm1.large', 
	  :image_id => '23f7f05f-3657-4330-8772-329ed2e816bc',  # Ubuntu Docker Image
	  :domain => 'staging.example.com',
	  :datacenter => 'ams01', # This needs to be the same datacenter as the target VLAN of course.
	  :name => 'additional-docker-host',
	  :vlan => staging.server.vlan, # Passing in a <Fog::Network::Softlayer::Network> object.
	  :private_vlan => staging.server.private_vlan.id, # Passing in an Integer (the id of a network/vlan) works too. 
	}

	new_staging_server = @sl.servers.create(opts)
	# => <Fog::Compute::Softlayer::Server>
	
	
	```
	
1. Provision a Server with only a private network.

	```ruby
	opts = {
	  :flavor_id => 'm1.large', 
	  :os_code => 'UBUNTU_LATEST',
	  :domain => 'example.com',
	  :datacenter => 'ams01',
	  :name => 'private-eye',
	  :private_network_only => true
	}
	
	private_vm = @sl.servers.create(opts)
	# => <Fog::Compute::Softlayer::Server>
	```
1. Provision a Server with 1Gbps network components.

	```ruby
	opts = {
	  :flavor_id => 'm1.large', 
	  :os_code => 'UBUNTU_LATEST',
	  :domain => 'example.com',
	  :datacenter => 'wdc01',
	  :name => 'speedy-tubes',
	  :network_components => [ {:speed => 1000 } ],
	}
	
	private_vm = @sl.servers.create(opts)
	# => <Fog::Compute::Softlayer::Server>
	```

1. Provision a Server with user metadata.

   ```ruby
     opts = {
      :flavor_id => "m1.small",
      :image_id => "23f7f05f-3657-4330-8772-329ed2e816bc",
      :name => "test",
      :datacenter => "ams01",
      :user_data => "my-custom-user-metadata"
     }

     new_server = @sl.servers.create(opts)
     new_server.user_data # => "my-custom-user-metadata"
     new_server.user_data = "new-user-metadata"
     new_server.user_data # => "new-user-metadata"
   ```

1. Start, Stop, and Reboot a existing server (works the same for VMs and Bare Metal).

	```ruby
		srvr = @sl.servers.get(123456)
		srvr.ready? # true
		
		srvr.reboot # true
		
		srvr.stop # true
		srvr.ready? # false
		srvr.state # "Halted"
		
		srvr.start # true
		srvr.ready # true
		srvr.state # "Running"
		
	```

1. Get all options to create a bare metal.

   ```ruby
   @sl.servers.get_bm_create_options
   ```

1. Get all options to create a VM.

   ```ruby
   @sl.servers.get_vm_create_options
   ```

1. Get all active tickets of a server.

  ```ruby
    server = @sl.servers.get(123456)
    server.get_active_tickets
  ```
  
1. Get all users of a server.

  ```ruby
    server = @sl.servers.get(123456)
    server.get_users
  ```

1. Get all upgrade options of a server.

  ```ruby
    server = @sl.servers.get(123456)
    server.get_upgrade_options
  ```

1. Update a virtual guest server.
Hash keys are the categories and the hash values are the capacity. You can retrieve them from upgrade options.

  ```ruby
    new_attributes = {
      :guest_core => 2,
      :ram => 1, # this value is in GBs
      :port_speed => 100, # this value is in MPBSs
      :time => Time.now + 5.minutes # if you don't specify, time will be equal to now
    }

    server = @sl.servers.get(123456)
    server.update(new_attributes)
  ```

1. Update a bare metal server.
Hash keys are the categories and the hash values are the capacity. You can retrieve them from upgrade options.

  ```ruby
    new_attributes = {
      :ram => 4, # this value is in GBs
      :port_speed => 100, # this value is in MPBSs
      :maintenance_window => 1111 # should see examples/network "Get a datacenter maintenance windows."
    }

    server = @sl.servers.get(123456)
    server.update(new_attributes)
  ```

1. Generate an order template for VM with flavor (simple).

   ```ruby
     opts = {
     	:flavor_id => "m1.small",
     	:image_id => "23f7f05f-3657-4330-8772-329ed2e816bc",
     	:name => "test",
     	:datacenter => "ams01"
     }
     new_server = @sl.servers.new(opts)
     new_server.generate_order_template
   ```

1. Generate an order template for Bare Metal instance with flavor (simple).

   ```ruby
     opts = {
     	:flavor_id => "m1.medium",
     	:os_code => "UBUNTU_LATEST",
     	:name => "test1",
     	:datacenter => "ams01",
     	:bare_metal => true
     }
     new_server = @sl.servers.new(opts)
     new_server.generate_order_template
   ```

1. Generate an order template for VM without flavor.

   ```ruby
   	opts = {
     	:cpu => 2,
     	:ram => 2048,
     	:disk => [{'device' => 0, 'diskImage' => {'capacity' => 100 } }],
     	:ephemeral_storage => true,
     	:domain => "not-my-default.com",
     	:name => "hostname",
     	:os_code => "UBUNTU_LATEST",
     	:name => "test2",
     	:datacenter => "ams01"
     }
     new_server = @sl.servers.new(opts)
     new_server.generate_order_template
   ```

1. Generate an order template for Bare Metal Instance without a flavor

   ```ruby
   opts = {
     	:cpu => 8,
     	:ram => 16348,
     	:disk => {'capacity' => 500 },
     	:ephemeral_storage => true,
     	:domain => "not-my-default.com",
     	:name => "hostname",
     	:os_code => "UBUNTU_LATEST",
     	:name => "test2",
     	:datacenter => "ams01",
     	:bare_metal => true
     }
     new_server = @sl.servers.new(opts)
     new_server.generate_order_template
   ```
