# Getting Started

This is a quick how-to on getting started with fog-softlayer covering all aspects from zero to hero using this library.

## Installation

You can just use as a gem on your system install as a global gem:

```bash
gem install fog-softlayer
```

or you can add to your Gemfile

```ruby
gem 'fog-softlayer
```

This is the only necessary step, after configuring your credentials in fog file (see how next on usage section) you can test your setup by executing the contents according to this [gist](https://gist.github.com/fernandes/58908649f25b218cc4a7)

## Usage

The first step to get into fog-softlayer is to configure your __~/.fog__ file. This is useful so that you do not have to retype credentials on every fog-softlayer use.

If you do not configure .fog, you will have to manually enter:

```ruby
@sl = Fog::Compute.new(provider: "softlayer", softlayer_username: "SLUSERNAME", softlayer_api_key: '860e03c168c3aef304341b492ba9984ac1080bb5')
```

This is not recommended since credentials or api-keys could be leaked.

Write a configure file like this under __~/.fog__

```yaml  
default:
  softlayer_username: example-username
  softlayer_api_key: 1a1a1a1a1a1a1a1a1a11a1a1a1a1a1a1a1a1a1 
  softlayer_default_domain: example.com
  softlayer_cluster: cluster # needed for storage access
```

After this file is configured you just need to use:

```ruby
@sl = Fog::Compute[:softlayer]
```

Remember, you can always specify the username and api key to connect using another credential.