# Fog vSphere
> VMware vSphere® provider for the Fog cloud services library

[![Gem Version][gemfury-image]][gemfury-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Code Climate][climate-image]][climate-url]

The VMware vSphere® provider allows you to use the abstractions of the Fog cloud services library to communicate with vSphere.

## Installation

To use this gem in your application, add this line to your Gemfile:

```ruby
gem 'fog-vsphere'
```

And then execute:

```bash
bundle
```

Or install it yourself as:

```bash
gem install fog-vsphere
```

## Usage

To connect to your vSphere instance with Fog vSphere:

```ruby
require 'fog/vsphere'

compute = Fog::Compute.new(
  provider: :vsphere,
  vsphere_username: 'username',
  vsphere_password: 'password',
  vsphere_server: 'server.example.com',
  vsphere_expected_pubkey_hash: '0123456789abcdef0123456789abcdef',
  vsphere_ssl: true,
  vsphere_rev: '6.0'
)
```

From there you can create, destroy, list, and modify most things related to vSphere. Some examples include:

```ruby
# continued from previous example

# List datacenters
compute.list_datacenters
#=> [{id: 'datacenter-1', name: 'DC1', path: ['DC1'], status: 'gray'},
#=>  {id: 'datacenter-2', name: 'DC2', path: ['DC2'], status: 'gray'}]

# Get datacenter by name
compute.get_datacenter('DC1')
#=> {name: 'DC1', status: 'gray', path: ['DC1']}

# List virtual machines
compute.list_virtual_machines
#=> [{'id'   => 'ab589f9a-af35-428e-9690-9b96587d86f3',
#=>   'name' => 'TestVM',
#=>   'uuid' => 'fc51eb7a-fa50-4d96-bd16-63972b49f52f',
#=> ...

# List a VM's SCSI controllers
compute.list_vm_scsi_controllers('ab589f9a-af35-428e-9690-9b96587d86f3')
#=> [<Fog::Compute::Vsphere::SCSIController
#=>   shared_bus='noSharing',
#=>   type='VirtualLsiLogicController',
#=>   unit_number=7,
#=>   key=1000,
#=>   server_id=nil
#=>  >]
```

There is a lot more you can do as well! We are working on providing better documentation right now. For now, you can look at the [RubyDocs](http://www.rubydoc.info/gems/fog-vsphere/), browse what's available with [Pry](http://pryrepl.org/), and view the documentation for [Fog](http://fog.io). We hope to have much more documentation and plenty of examples soon.

## Contributing

To contribute to this project, add an issue or pull request. For more info on what that means or how to do it, see [this guide](https://guides.github.com/activities/contributing-to-open-source/#contributing) from GitHub.

[climate-image]: https://codeclimate.com/github/fog/fog-vsphere.svg
[climate-url]: https://codeclimate.com/github/fog/fog-vsphere
[coverage-image]: https://codeclimate.com/github/fog/fog-vsphere/badges/coverage.svg
[coverage-url]: https://codeclimate.com/github/fog/fog-vsphere/coverage
[gemfury-image]: https://badge.fury.io/rb/fog-vsphere.svg
[gemfury-url]: http://badge.fury.io/rb/fog-vsphere
[gemnasium-image]: https://gemnasium.com/fog/fog-vsphere.svg
[gemnasium-url]: https://gemnasium.com/fog/fog-vsphere
[travis-image]: https://travis-ci.org/fog/fog-vsphere.svg?branch=master
[travis-url]: https://travis-ci.org/fog/fog-vsphere
