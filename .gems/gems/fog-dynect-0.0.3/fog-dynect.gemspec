# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/dynect/version'

Gem::Specification.new do |spec|
  spec.name          = 'fog-dynect'
  spec.version       = Fog::Dynect::VERSION
  spec.authors       = ['Wesley Beary', 'The fog team']
  spec.email         = ['geemus@gmail.com']
  spec.summary       = "Module for the 'fog' gem to support Dynect DNS."
  spec.description   = 'This library can be used as a module for `fog` or as
                        standalone provider to use Dynect DNS in applications.'
  spec.homepage      = 'http://github.com/fog/fog-dynect'
  spec.license       = 'MIT'

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ['lib']

  spec.add_development_dependency 'bundler'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'shindo', '~> 0.3'

  spec.add_dependency 'fog-core'
  spec.add_dependency 'fog-json'
  spec.add_dependency 'fog-xml'
end
