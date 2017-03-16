# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/sakuracloud/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-sakuracloud"
  spec.version       = Fog::Sakuracloud::VERSION
  spec.authors       = ["sawanoboly"]
  spec.email         = ["sawanoboriyu@higanworks.com"]
  spec.summary       = %q{Module for the 'fog' gem to support Sakura no Cloud}
  spec.description   = %q{Module for the 'fog' gem to support Sakura no Cloud}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency "fog-core"
  spec.add_dependency "fog-json"

  spec.add_development_dependency "bundler", "~> 1.5"
  ## List your development dependencies here. Development dependencies are
  ## those that are only needed during development
  spec.add_development_dependency('minitest')
  spec.add_development_dependency('rake')
  spec.add_development_dependency('rbvmomi')
  spec.add_development_dependency('yard')
  spec.add_development_dependency('thor')
  spec.add_development_dependency('rbovirt', '0.0.24')
  spec.add_development_dependency('shindo', '~> 0.3.4')
  spec.add_development_dependency('fission')
  spec.add_development_dependency('pry')
  spec.add_development_dependency('rubocop') if RUBY_VERSION > "1.9"

end
