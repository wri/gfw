### Product Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.

#### Product Service

SoftLayer has Product Service that is used for complex ordering process, so we support getting information on packages and items.

All data available on the real api is available using the Fog.mock! so you can provide a real experience using mocks.

This is the first version of this service and our intention is to support more feature and allow reuse on the buying process.

#### Create a connection to SoftLayer Product Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::Softlayer[:product]
```

#### Use the Models
1. List all packages

   ```ruby
   @sl.packages # list all packages
   ```

1. Get first package

   ```ruby
    pkg = @sl.packages.first
    # =>   <Fog::Softlayer::Product::Package
    #     id=0,
    #     description=nil,
    #     first_order_step_id=1,
    #     is_active=1,
    #     name="Additional Products",
    #     sub_description=nil,
    #     unit_size=0
    #   >
   ```

1. Get items for a package.

	```ruby
	items = @sl.packages.first.items		
	```
items will be a collection of Fog::Softlayer::Product::Item models.

1. Get a specific item

	```ruby
  @sl.packages.first.items.get(559)
    # =>   <Fog::Softlayer::Product::Item
    #     id=559,
    #     capacity=40.0,
    #     description="40GB EVault Disk to Disk Enterprise Backup",
    #     item_tax_category_id=166,
    #     key_name="EVAULT_40_GB",
    #     long_description=nil,
    #     software_description_id=159,
    #     units="GIGABYTE",
    #     upgrade_item_id=3784
	```

We need to make this nested call because we need package id on our items model, because items are related to packages.
