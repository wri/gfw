### Account Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.


#### Create a connection to SoftLayer Account Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::Account[:softlayer]
```

1. Create a sub-brand (First way)
```ruby
  attributes = {
      'key_name' => "T_B",
      'long_name' => "Long Test Brand Name",
      'name' => "My name",
      'account' => {
        address1: "Street",
        city: "City",
     	companyName: "Example",
    	country: "BR",
    	email: "example@example.com",
    	firstName: "FirstName",
    	lastName: "LastName",
    	postalCode: "0000-000",
    	state: "EX"
      } 
    }
  @brand = @sl.brands.create(attributes)
```

1. Create a sub-brand (Second way)
```ruby
  attributes = {
      'key_name' => "T_B",
      'long_name' => "Long Test Brand Name",
      'name' => "My name",
      'account' => {
        address1: "Street",
        city: "City",
     	companyName: "Example",
    	country: "BR",
    	email: "example@example.com",
    	firstName: "FirstName",
    	lastName: "LastName",
    	postalCode: "0000-000",
    	state: "EX"
      } 
    }
  @brand = @sl.brands.new(attributes)
  @brand.save
```

1. Create a sub-brand (Third way)
```ruby
  attributes = {
      'key_name' => "T_B",
      'long_name' => "Long Test Brand Name",
      'name' => "My name",
      'account' => {
        address1: "Street",
        city: "City",
     	companyName: "Example",
    	country: "BR",
    	email: "example@example.com",
    	firstName: "FirstName",
    	lastName: "LastName",
    	postalCode: "0000-000",
    	state: "EX"
      } 
  }
  @brand = @sl.brands.new(attributes)
  @brand.create
```

1. Get all brand accounts
```ruby
  @brand = @sl.brands.get(id)
  @brand.get_accounts
```
