### DNS Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.


#### Create a connection to SoftLayer DNS Service

```ruby
	require 'fog/softlayer'
	@sl = Fog::DNS[:softlayer]
```

##### Create Operations

* Create Domain

  ```ruby
  @domain = @sl.domains.create('yourdomain.com')
  ```

* Create Record

  ```ruby
  record = {
    'value' => '127.0.0.1',
    'host' => '@',
    'type' => 'a'
  }
  @domain.create_record(record)
  ```

##### Read Operations

* List all domains

  ```ruby
  @domains = @sl.domains.all
  @domain = @domains.first
  ```

* Get specific domain by id

  ```ruby
  @domain = @sl.domains.get(123456)
  ```

* Get specific domain by name

  ```ruby
  @domain = @sl.domains.get_by_name('yourdomain.com')
  ```

* Get Domains Records

  ```ruby
  @domain = @sl.domains.get(123456)
  @domain.records
  ```
  
* Get specific record by id

  ```ruby
  @domain = @sl.domains.get(123456)
  @domain.records.get(456789012)
  ```
  
or using the service:

  ```ruby
  @sl.records.get(456789012)
  ```

##### Update Operations

After this point we consider you have a Fog::DNS::Softlayer::Domain on @domain variable

* Update Record Entry

  ```ruby
  @domain.records
  @domain.records[3].value = "192.168.0.3"
  @domain.records[3].save
  ```

##### Destroy Operations

After this point we consider you have a Fog::DNS::Softlayer::Domain on @domain variable

* Destroy Domain

  ```ruby
  @domain = @sl.domains.get(123456)
  @domain.destroy
  ```

* Destroy Record

  ```ruby
  @domain = @sl.domains.get(123456)
  @domain.records.last.destroy
  ```
