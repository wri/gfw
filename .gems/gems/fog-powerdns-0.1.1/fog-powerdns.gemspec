# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/powerdns/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-powerdns"
  spec.version       = Fog::PowerDNS::VERSION
  spec.authors       = ["Chris Luo"]
  spec.email         = ["luo_christopher@bah.com"]

  spec.summary       = %q{Module for the 'fog' gem to support PowerDNS DNS services.}
  spec.description   = %q{This library can be used as a module for 'fog' or as a standalone provider to use PowerDNS DNS services in applications.}
  spec.homepage      = "http://github.com/cluobah/fog-powerdns"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.8"
  spec.add_development_dependency "rake", "~> 10.0"

  spec.add_dependency 'fog-core', '~> 1.27'
  spec.add_dependency 'fog-json', '~>1.0'
  spec.add_dependency 'fog-xml', '~>0.1'
end
