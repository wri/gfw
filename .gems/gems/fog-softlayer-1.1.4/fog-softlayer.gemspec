# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/softlayer/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-softlayer"
  spec.version       = Fog::Softlayer::VERSION
  spec.authors       = ["Matt Eldridge"]
  spec.email         = ["matt.eldridge@us.ibm.com"]
  spec.date          = Date.today.to_s
  spec.description   = %q{Module for the 'fog' gem to support SoftLayer Cloud}
  spec.summary       = %q{This library can be used as a module for `fog` or as standalone provider
                        to use the SoftLayer Cloud in applications}
  spec.homepage      = "https://github.com/fog/fog-softlayer"
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency 'fog-core'
  spec.add_dependency 'fog-json'

  spec.add_development_dependency('minitest')
  spec.add_development_dependency('rake')
  spec.add_development_dependency('rbvmomi')
  spec.add_development_dependency('yard')
  spec.add_development_dependency('thor')
  spec.add_development_dependency('rbovirt', '0.0.24')
  spec.add_development_dependency('shindo', '~> 0.3.4')
  spec.add_development_dependency('fission')
  spec.add_development_dependency('pry')
  spec.add_development_dependency('osrcry')
end
