# Fog::Aliyun

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'fog-aliyun'
```

And then execute:
```shell
    $ bundle
```

Or install it yourself as:

```shell
    $ gem install fog-aliyun
```

## Usage
Before you can use fog-aliyun, you must require it in your application:

```ruby
require 'fog/aliyun'
```

Since it's a bad practice to have your credentials in source code, you should load them from default fog configuration file: ```~/.fog```. This file could look like this:

```
default:
  :aliyun_accesskey_id:     <YOUR_ACCESS_KEY_ID>,
  :aliyun_accesskey_secret: <YOUR_SECRET_ACCESS_KEY>,
  :aliyun_oss_endpoint:     <YOUR_OSS_ENDPOINT>,
  :aliyun_oss_location:     <YOUR_OSS_LOACTION>,
  :aliyun_oss_bucket:       <YOUR_OSS_BUCKET>
```

### Connecting to OSS
```ruby
conn = Fog::Storage[:aliyun]
```

If you haven't modified your default fog configuration file or you don't want to use it, you can load your credentials by this way:
```ruby
opt = {
  :provider                => 'aliyun',
  :aliyun_accesskey_id     => <YOUR_ACCESS_KEY_ID>,
  :aliyun_accesskey_secret => <YOUR_SECRET_ACCESS_KEY>,
  :aliyun_oss_endpoint     => <YOUR_OSS_ENDPOINT>,
  :aliyun_oss_location     => <YOUR_OSS_LOACTION>,
  :aliyun_oss_bucket       => <YOUR_OSS_BUCKET>,
}
conn = Fog::Storage.new(opt)
```

## Fog::Aliyun Abstractions

Fog::Aliyun provides both a **model** and **request** abstraction. The request abstraction provides the most efficient interface and the model abstraction wraps the request abstraction to provide a convenient `ActiveModel` like interface.

### Request Layer
The Fog::Storage object supports a number of methods that wrap individual HTTP requests to the OSS API.

To see a list of requests supported by the storage service:

conn.requests

This returns:
```
[[nil, :copy_object], [nil, :delete_bucket], [nil, :delete_object], [nil, :get_bucket], [nil, :get_object], [nil, :get_object_http_url], [nil, :get_object_https_url], [nil, :head_object], [nil, :put_bucket], [nil, :put_object], [nil, :list_buckets], [nil, :list_objects], [nil, :get_containers], [nil, :get_container], [nil, :delete_container], [nil, :put_container]]
```

#### Example Requests(list_buckets)
To request all of buckets:

```ruby
conn.list_buckets
```

And this returns like the flowing;
```
[{"Location"=>"oss-cn-beijing", "Name"=>"dt1", "CreationDate"=>"2015-07-30T08:38:02.000Z"},  {"Location"=>"oss-cn-shenzhen", "Name"=>"ruby1", "CreationDate"=>"2015-07-30T02:22:34.000Z"}, {"Location"=>"oss-cn-qingdao", "Name"=>"yuanhang123", "CreationDate"=>"2015-05-18T03:06:31.000Z"}]
```

You can also request in this way;
```ruby
conn.list_buckets(:prefix=>"pre")
```

Here is a summary of the optional parameters:
<table>
<tr>
<th>Parameters</th>
<th>Description</th>
</tr>
<tr>
<td>:prefix</td>
<td>
The bucket name of the results must start with 'prefix'.It won't filter prefix information if not set<br>
Data Types: String<br>
Defaults:none
</td>
</tr>
<tr>
<td>:marker</td>
<td>
The result will start from the marker alphabetically.It wil start from the first if not set.<br>
Data Types: String<br>
Defaults: none
</tr>
<tr>
<td>:maxKeys</td>
<td>
Set the max number of the results. It will set to 100 if not set. The max value of maxKeys is 1000.<br>
Data Types: String<br>
Defaults: 100
</td>
</tr>
</table>

To learn more about `Fog::Aliyun` request methods, you can refer to our source code. To learn more about OSS API, refer to [AliYun OSS API](https://docs.aliyun.com/?spm=5176.383663.9.2.jpghde#/pub/oss/api-reference/abstract).

### Model Layer
Fog models behave in a manner similar to `ActiveModel`. Models will generally respond to `create`, `save`,  `destroy`, `reload` and `attributes` methods. Additionally, fog will automatically create attribute accessors.

Here is a summary of common model methods:

<table>
<tr>
<th>Method</th>
<th>Description</th>
</tr>
<tr>
<td>create</td>
<td>
Accepts hash of attributes and creates object.<br>
Note: creation is a non-blocking call and you will be required to wait for a valid state before using resulting object.
</td>
</tr>
<tr>
<td>save</td>
<td>Saves object.<br>
Note: not all objects support updating object.</td>
</tr>
<tr>
<td>destroy</td>
<td>
Destroys object.<br>
Note: this is a non-blocking call and object deletion might not be instantaneous.
</td>
<tr>
<td>reload</td>
<td>Updates object with latest state from service.</td>
<tr>
<td>attributes</td>
<td>Returns a hash containing the list of model attributes and values.</td>
</tr>
<td>identity</td>
<td>
Returns the identity of the object.<br>
Note: This might not always be equal to object.id.
</td>
</tr>
</table>

The remainder of this document details the model abstraction.

**Note:** Fog sometimes refers to OSS containers as directories.

## List Directories

To retrieve a list of directories:

```ruby
dirs = conn.directories
```

This returns a collection of `Fog::Storage::Aliyun::Directory` models:

## Get Directory

To retrieve a specific directory:

```ruby
dir = dirs.get "dir"
```

This returns a `Fog::Storage::Aliyun::Directory` instance:

## Create Directory

To create a directory:

```ruby
dirs.create :key => 'backups'
```

## Delete Directory

To delete a directory:

```ruby
directory.destroy
```

**Note**: Directory must be empty before it can be deleted.


## Directory URL

To get a directory's URL:

```ruby
directory.public_url
```

## List Files

To list files in a directory:

```ruby
directory.files
```

**Note**: File contents is not downloaded until `body` attribute is called.

## Upload Files

To upload a file into a directory:

```ruby
file = directory.files.create :key => 'space.jpg', :body => File.open "space.jpg"
```

**Note**: For files larger than 5 GB please refer to the [Upload Large Files](#upload_large_files) section.


## Upload Large Files

OSS requires files larger than 5 GB (the OSS default limit) to be uploaded into segments along with an accompanying manifest file. All of the segments must be uploaded to the same container.

Segmented files are downloaded like ordinary files. See [Download Files](#download-files) section for more information.

## Download Files

The most efficient way to download files from a private or public directory is as follows:

```ruby
File.open('downloaded-file.jpg', 'w') do | f |
  directory.files.get("my_big_file.jpg") do | data, remaining, content_length |
    f.syswrite data
  end
end
```

This will download and save the file.

**Note**: The `body` attribute of file will be empty if a file has been downloaded using this method.

If a file object has already been loaded into memory, you can save it as follows:

```ruby
File.open('germany.jpg', 'w') {|f| f.write(file_object.body) }
```

**Note**: This method is more memory intensive as the entire object is loaded into memory before saving the file as in the example above.


## File URL

To get a file's URL:

```ruby
file.public_url
```

## Copy File

Cloud Files supports copying files. To copy files into a container named "trip" with a name of "europe.jpg" do the following:

```ruby
file.copy("trip", "europe.jpg")
```

To move or rename a file, perform a copy operation and then delete the old file:

```ruby
file.copy("trip", "germany.jpg")
file.destroy
```

## Delete File

To delete a file:

```ruby
file.destroy
```
## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

