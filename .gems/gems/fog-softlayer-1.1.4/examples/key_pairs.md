### Key Pair Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.

  
#### Create a connection to SoftLayer Compute Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::Compute[:softlayer]
```

#### Key Pair Basics
1. Create

   ```ruby
	kp1 = @sl.key_pairs.create(:label => 'my-new-key', :key => 'ssh-rsa AAAAxbU2lx...')
   # => <Fog::Compute::Softlayer::KeyPair>
	kp2 = @sl.key_pairs.new
	kp2.label = 'my-new-new-key'
	kp2.key = 'ssh-rsa AAAAxbU2lx...'
	kp2.save
	# => <Fog::Compute::Softlayer::KeyPair>
   ```

1. Get

	```ruby
	# By id:
	kp = @sl.key_pairs.get(123456)
	# => <Fog::Compute::Softlayer::KeyPair>

	# By label:
	kp = @sl.key_pairs.by_label('my-new-key')
	# => <Fog::Compute::Softlayer::KeyPair>
	```


1. Destroy

	```ruby
	kp = @sl.key_pairs.by_label('my-new-key')
	# => <Fog::Compute::Softlayer::KeyPair>
	kp.destroy
	```

	
### Key Pairs with Servers
1. Create a server with one or more key pairs

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

1. Look at the key pairs on a server.

	```ruby
	server = @sl.servers.get(12345)
	server.key_pairs
	# => [ <Fog::Compute::Softlayer::Server>,
	# <Fog::Compute::Softlayer::Server>]
	```