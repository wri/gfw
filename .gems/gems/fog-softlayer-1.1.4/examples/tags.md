### Tags Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.

  
#### Create a connection to SoftLayer Compute Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::Compute[:softlayer]
```

#### Tags with Servers
1. Add some tags to a server.

   ```ruby
   server = @sl.servers.get(1234567) # get the server in question
   server.add_tags(['sparkle', 'motion']) # => true
   ```

1. Verify that the tags stuck.

   ```ruby
   server.tags # => ["sparkle", "motion"]
   ```

1. Remove a tag.

   ```ruby
   server.tags # => ["sparkle", "motion"]
   server.delete_tags(["sparkle"]) # => true
   server.tags # => ["motion"]
   ```

1. Put it back.

   ```ruby
   server.tags # => ["motion"]
   server.add_tags(['sparkle']) # => true     
   server.tags # => ["sparkle", "motion"]
   ```

1. Get servers tagged by a single tag.

   ```ruby
   	@sl.servers.tagged_with(['foo']) # => [<Fog::Compute::Softlayer::Server>, <Fog::Compute::Softlayer::Server>, ...]
   ```

1. Get servers tagged by multiple tags (tag OR tag OR ...).

   ```ruby
   	@sl.servers.tagged_with(['foo','bar']) # => [<Fog::Compute::Softlayer::Server>, <Fog::Compute::Softlayer::Server>, ...]
   ```

1. List all tags on account that have been assigned to a server.

   ```ruby
   	  @sl.tags.all # => [<Fog::Compute::Softlayer::Tag>, <Fog::Compute::Softlayer::Tag>, ...]
     ```
1. Anatomy of a Tag object.

	```ruby
	<Fog::Compute::Softlayer::Tag
    id=32850, # SoftLayer assigned ID
    name="sparkle", # the tag itself
    referenceCount=2, # number of SL API objects that "have" this tag
    resource_id=nil, # fog-softlayer property used by models
    internal=0 # SoftLayer API flag indicating user assigned (0) or system assigned (1)
  	>
	```
	
1. Miscellany

	```ruby
	tag = @sl.tags.get(32850)
	tag.references # => [<Fog::Compute::Softlayer::Server>, <Fog::Compute::Softlayer::Server>, ...]
	```
	
#### Create a connection to SoftLayer Network Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::Network[:softlayer]
```

#### Tags with Networks

1. Add some tags to a network.

   ```ruby
   net = @sl.networks.get(1234567) # get the network in question
   net.add_tags(['sparkle', 'motion']) # => true
   ```

1. Verify that the tags stuck.

   ```ruby
   net.tags # => ["sparkle", "motion"]
   ```

1. Remove a tag.

   ```ruby
   net.tags # => ["sparkle", "motion"]
   net.delete_tags(["sparkle"]) # => true
   net.tags # => ["motion"]
   ```

1. Put it back.

   ```ruby
   net.tags # => ["motion"]
   net.add_tags(['sparkle']) # => true     
   net.tags # => ["sparkle", "motion"]
   ```

1. Get networks tagged by a single tag.

   ```ruby
   	@sl.networks.tagged_with(['foo']) # => [<Fog::Network::Softlayer::Network>, <Fog::Network::Softlayer::Network>, ...]
   ```

1. Get networks tagged by multiple tags (tag OR tag OR ...).

   ```ruby
   	@sl.networks.tagged_with(['foo','bar']) # => [<Fog::Network::Softlayer::Network>, <Fog::Network::Softlayer::Network>, ...]
   ```

1. List all tags on account that have been assigned to a network.

   ```ruby
   	  @sl.tags.all # => [<Fog::Network::Softlayer::Network>, <Fog::Network::Softlayer::Network>, ...]
     ```
1. Anatomy of a Tag object.

	```ruby
	<Fog::Network::Softlayer::Tag
    id=32850, # SoftLayer assigned ID
    name="sparkle", # the tag itself
    referenceCount=2, # number of SL API objects that "have" this tag
    resource_id=nil, # fog-softlayer property used by models
    internal=0 # SoftLayer API flag indicating user assigned (0) or system assigned (1)
  	>
	```
	
1. Miscellany

	```ruby
	tag = @sl.tags.get(32850)
	tag.references # => [<Fog::Network::Softlayer::Network>, <Fog::Network::Softlayer::Network>, ...]
	```

