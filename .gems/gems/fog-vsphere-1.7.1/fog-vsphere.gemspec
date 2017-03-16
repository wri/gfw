# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/vsphere/version'

Gem::Specification.new do |spec|
  spec.name          = 'fog-vsphere'
  spec.version       = Fog::Vsphere::VERSION
  spec.authors       = ['J.R. Garcia']
  spec.email         = ['jrg@vmware.com']

  spec.summary       = "Module for the 'fog' gem to support VMware vSphere."
  spec.description   = 'This library can be used as a module for `fog` or as standalone provider to use vSphere in applications.'
  spec.homepage      = 'https://github.com/fog/fog-vsphere'
  spec.license       = 'MIT'

  spec.files         = `git ls-files -z`.split("\x0")
  spec.test_files    = spec.files.grep(%r{^tests\/})

  spec.require_paths = ['lib']

  spec.required_ruby_version = '>= 1.8.7'

  spec.add_runtime_dependency 'fog-core'
  spec.add_runtime_dependency 'rbvmomi', '~> 1.9'

  spec.add_development_dependency 'bundler', '~> 1.10'
  spec.add_development_dependency 'pry', '~> 0.10'
  spec.add_development_dependency 'rake', '~> 10.0'
  spec.add_development_dependency 'minitest', '~> 5.8'
  spec.add_development_dependency 'rubocop', '~> 0.34'
  spec.add_development_dependency 'shindo', '~> 0.3'
end
