# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/rackspace/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-rackspace"
  spec.version       = Fog::Rackspace::VERSION
  spec.authors       = ["Matt Darby"]
  spec.email         = ["matt.darby@rackspace.com"]

  spec.summary       = %q{Rackspace support for Fog}
  spec.description   = %q{Rackspace provider gem for Fog}
  spec.homepage      = "http://developer.rackspace.com"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency 'bundler', '~> 1.6'
  spec.add_development_dependency 'rake',    '~> 10.0'
  spec.add_development_dependency 'shindo',  '~> 0.3'
  spec.add_development_dependency 'rspec',  '~> 3.4'
  spec.add_development_dependency 'rubyzip', '~> 0.9.9'
  spec.add_development_dependency 'pry', '~> 0.10.3'
  spec.add_development_dependency 'vcr', '~> 3.0.1'
  spec.add_development_dependency 'webmock', '~> 1.24.2'
  spec.add_development_dependency "mime-types"
  spec.add_development_dependency "mime-types-data"

  spec.add_dependency 'fog-core',  '>= 1.35'
  spec.add_dependency 'fog-json',  '>= 1.0'
  spec.add_dependency 'fog-xml',   '>= 0.1'
  spec.add_dependency 'ipaddress', '>= 0.8'
end
