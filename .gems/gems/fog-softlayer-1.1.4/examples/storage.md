### Storage Examples

If you are unfamiliar with fog, we recommend reading our [getting started](getting_started.md) guide.


#### Create a connection to SoftLayer Object Storage

```ruby
	require 'fog/softlayer'
	@sl = Fog::Storage[:softlayer]
```

#### Create a connection within a Bluemix Application to Bluemix v1 Object Storage

```ruby
	require 'fog/softlayer'
	objstor_service = JSON.parse(ENV['VCAP_SERVICES'])["objectstorage"].first["credentials"]
	bluemix_app_name = JSON.parse(ENV["VCAP_APPLICATION"])["name"]

	@sl = Fog::Storage.new({
	   :provider => 'softlayer',
	   :softlayer_username => objstor_service['username'].to_s,
	   :softlayer_api_key => objstor_service['password'].to_s,
	   :softlayer_storage_account => bluemix_app_name, 
	   :softlayer_bluemix_objstor_auth_url => objstor_service['auth_uri'].to_s,
	   :softlayer_cluster => 'dal05'
	})
```

#### Use the Models
1. List directories/containers.

   ```ruby
    dirs = @sl.directories
    dirs.size # the number of directories      
   ```
1. Create a directory/container.

  ```ruby
  	@sl.directories.create(:key => 'a-container')
  ```

1. Get a directory/container

  ```ruby
  	dir = @sl.directories.get('a-container')
  	dir.key  # => 'a-container'
  ```


1. Create a new file/object

  ```ruby
  	dir = @sl.directories.get('a-container')
  	# Pass a string.
  	dir.files.create(:key => 'data.txt', :body => 'The quick brown fox jumps over the lazy dog.')
  	# From a file.
  	dir.files.create(:key => 'file-data.txt', :body => File.open('/path/to/file-data.txt')
  ```


1. Get an existing file/object

  ```ruby
  	dir = @sl.directories.get('a-container')
  	file = dir.files.get('data.txt')
  	file.body # => 'The quick brown fox jumps over the lazy dog.'
  ```



1. Copy a file/object

  ```ruby
  	file  = @sl.directories.get('a-container').files.get('data.txt')
  	copy = file.copy('a-container', 'copy-of-data.txt')
  	copy.body # => 'The quick brown fox jumps over the lazy dog.'
  ```



1. List the files in a directory/container

  ```ruby
   @sl.directories.get('a-container').files
   # => [
   #    <Fog::Storage::Softlayer::File
   #  key="a-container/data.txt",
   #  content_length=43,
   #  content_type="text/plain",
   #  content_disposition=nil,
   #  etag="a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
   #  last_modified=1970-00-00 00:00:00 -0000,
   #  access_control_allow_origin=nil,
   #  origin=nil
   #  >
   # ...
  ```

1. Get a signed [temporary] url for a file/object

	```ruby
	  ### NOTE 
	  ## Be sure you have set a meta_temp_url_key for your account at least once before
	  ## @sl.post_set_meta_temp_url_key('someSortaSecretStuffHere')
	  ### /NOTE
	  
	  file = @sl.directories.get('a-container').files.get('data.txt')
	  file.url(Time.now + 300) # url expires in 5 minutes
	  # => "https://dal05.objectstorage.softlayer.net:443/v1/AUTH_1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a/a-container/data.txt?temp_url_sig=1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a&temp_url_expires=1401901023"
	```
	
1. Delete files/objects from a directory/container.

	```ruby
		dir = @sl.directories('a-container')
		dir.files.get('data.txt').destroy
		dir.files.get('file-data.txt').destroy
		dir.files.get('copy-of-data.txt').destroy
		# Must destroy all files/objects before destroying container.
		dir.destroy
	```
	
	
