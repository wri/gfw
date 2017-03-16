#### Global IP Address examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.

##### Create a connection to SoftLayer network

```ruby
require 'fog/softlayer'
@sl = Fog::Network[:softlayer]
```

Global IP addresses are accessed through the `Fog::Network::Softlayer::Ip` model.  Unlike "normal" IP addresses they can be specifically created and destroyed (non-global IP addresses are created/destroyed via a subnet).

   ```ruby
    global_ips = @network.ips.select { |ip| ip.global? }
    # => [ <Fog::Network::Softlayer::Ip
    #  id=123456789,
    #  subnet_id=123456,
    #  address="203.0.113.5",
    #  broadcast=false,
    #  gateway=false,
    #  network=false,
    #  reserved=false,
    #  global_id=1234,
    #  destination_ip=nil,
    #  note=nil,
    #  assigned_to=nil
    # >,
	# <Fog::Network::Softlayer::Ip
    #  id=123456790,
    #  subnet_id=123457,
    #  address="203.0.113.6",
    #  broadcast=false,
    #  gateway=false,
    #  network=false,
    #  reserved=false,
    #  global_id=1235,
    #  destination_ip= <Fog::Network::Softlayer::Ip
    #    id=123458,
    #    subnet_id=123456,
    #    address="203.0.113.7",
    #    broadcast=false,
    #    gateway=false,
    #    network=false,
    #    reserved=false,
    #    global_id=nil,
    #    destination_ip=nil,
    #    note=nil,
    #    assigned_to=nil
    #  >,
    #  note=nil,
    #  assigned_to=nil
    # >
    # ]
   ```




Route an unrouted global IP to a specific server:

```ruby
global_ip = @network.ips.select { |ip| ip.global? && !ip.routed? }.first
# => <Fog::Network::Softlayer::Ip
#  id=123456789,
#  subnet_id=123456,
#  address="203.0.113.5",
#  broadcast=false,
#  gateway=false,
#  network=false,
#  reserved=false,
#  global_id=1234,
#  destination_ip=nil,
#  note=nil,
#  assigned_to=nil
# >
global_ip.routed? # => false


@compute = Fog::Compute[:softlayer]
dest_server = @compute.servers.tagged_with(['production', 'frontend', 'hkg']).first # => <Fog::Compute::Softlayer::Server>
dest_ip = @network.ips.by_address(dest_server.public_ip_address) # => <Fog::Network::Softlayer::Ip>


global_ip.route(dest_ip) # => true

global_ip.reload
# => <Fog::Network::Softlayer::Ip
#  id=123456789,
#  subnet_id=123456,
#  address="203.0.113.5",
#  broadcast=false,
#  gateway=false,
#  network=false,
#  reserved=false,
#  global_id=1234,
#  destination_ip= <Fog::Network::Softlayer::Ip
#    id=123458,
#    subnet_id=123456,
#    address="203.0.113.8",
#    broadcast=false,
#    gateway=false,
#    network=false,
#    reserved=false,
#    global_id=nil,
#    destination_ip=nil,
#    note=nil,
#    assigned_to=nil
#  >,
#  note=nil,
#  assigned_to=nil
# >

global_ip.routed?
# => true
```

That same address to a different server:

```ruby
global_ip = @network.ips.by_address('203.0.113.5')
global_ip.destination.address # => 203.0.113.8

london_server = @compute.servers.tagged_with(['production', 'frontend', 'lon']).first # => <Fog::Compute::Softlayer::Server>
dest_ip = @network.ips.by_address(london_server.public_ip_address) # => <Fog::Network::Softlayer::Ip>

global_ip.route(dest_ip) # => true
global_ip.reload # => <Fog::Network::Softlayer::Ip>
global_ip.destination.address # => 203.0.113.9
```

Unroute the same address:
```ruby
global_ip = @network.ips.by_address('203.0.113.5')
global_ip.routed? # => true

global_ip.unroute # => true
global_ip.reload # => <Fog::Network::Softlayer::Ip>

global_ip.routed? # => false
```

Create new IPv4:
*Note:* these methods are blocking and can take several seconds to respond.
```ruby
@network.create_new_global_ipv4 # => <Fog::Network::Softlayer::Ip>
```

Create new IPv6:
```ruby
@network.create_new_global_ipv6 # => <Fog::Network::Softlayer::Ip>
```

Destroy a global IP address:
```ruby
ip = @network.ips.by_address('203.0.113.5')
ip.global? # => true
ip.destroy # => true
```

   	
	
