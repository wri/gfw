# v1.1.0
__features__

* Add support for pre-configured bare metal with fast provisioning times.

# v0.4.7

__features__

* Improve management on Bare Metal, upgrading and updating machines
  (supports also maintenance windows) @mfbmina 

* Initial support for [Brand
  Service](http://sldn.softlayer.com/reference/services/SoftLayer_Brand),
actually creating new brand records @mfbmina 

__fixes__

* Validate SoftLayer username format @ravinggenius 

# v0.4.6

__features__

* Generate order template for Bare Metal and Virtual Machines

* Get upgrade options (and prices!) for machines @mfbmina

* Retrieve maintenance windows on datacenter @mfbmina

__fixes__

No fixes! :wink:

# v0.4.5

__fixes__

Load value of @public when getting a container @cphrmky

# v0.4.4

__features__

Finish implementation that allow creation of public object storage
containers/directories @cphrmky

__fixes__

No fixes! :wink:

# v0.4.3

__fixes__

Add missing parameter to get_vm and get_vms requests @cphrmky

# v0.4.2

__features__

* Get server details using IP Address @mfbmina

* Get Bare Metal and Virtual Machines create options @mfbmina

* Get active tickets for server @mfbmina

* Get all users of a server @mfbmina

# v0.4.1

__features__

* Implemented stop, start and reboot operations for virtual and bare
  metal servers @mafabra

* Initial support on ordering SoftLayer Products @fernandes

* Support setting network link speed when creating a compute instance
  @cphrmky

* Support sshable? from fog-core @cphrmky

* Set user metadata

__fixes__

* Decreased cores on tiny template @urasoko

* Fix for API user with `@` character @fernandes

* Set correct headers @plribeiro3000

* Fix bug on SLAPI request @cphrmky

* Avoid overwriting Hash#deep_merge @amatsuda

## 0.3.10 2014-07-22
* Added support for Global IP addresses
  * Create.
  * Destroy.
  * Route.
  * Unroute.

## 0.3.7 2014-07-11
* Added support for ssh key pairs.
  * See [key_pairs.md](https://github.com/fog/fog-softlayer/blob/master/examples/key_pairs.md) for details.
* Fix [issue 19](https://github.com/fog/fog-softlayer/issues/19) Storage initialization bug.
* Fix [issue 17](https://github.com/fog/fog-softlayer/issues/17), incompatibility with Rails 4.1.4. *thanks konsti*
* Updated .fog file example and datacenter option. *thanks urasoko*
* Fix [issue 14](https://github.com/fog/fog-softlayer/issues/14), added `:private_network_only` flag to Server model. 

## 0.3.2 2014-06-30
* No longer requires `fog` gem.

## 0.3.0 2014-06-26

* Added Network service.
  * Network model.
  * Subnet model.
  * Ip model.
  * Tag model.
* Added vlan and private_vlan properties to Server model.
* Fixed up bare_metal? on Server so it's not a hack. *thanks fernandes*
* Fixed Bundler/dep issues with Ruby 1.8.7. *thanks fernandes*
* Added some missing license headers.
* Updated Compute examples and Tag examples to reflect new Network service.
* Moved shared logic from `lib/fog/softlayer/compute.rb` to `lib/fog/softlayer/core.rb`

## 0.2.1 2014-06-17
* Add support for SoftLayer Tags on Compute resources.

## 0.1.1 2014-06-10

* Fix Compute model after breaking change to SLAPI. :datacenter is no longer optional.

## 0.1.0 2014-06-10

* Add missing get method to Fog::DNS::Softlayer::Record.
* Add OS attribute and ssh_password method to Compute model.

### 0.0.9 2014-06-10

* Initial support for DNS.

### 0.0.8 2014-06-05

* Released support for Object Storage.

### 0.0.7 2014-05-29

* Compute requests and models initial development complete.  Supports both VMs and BMC.
* Storage requests and models initial development complete.

### 0.0.1 / 2014-04-18

* Initial release of `fog-softlayer` module.
