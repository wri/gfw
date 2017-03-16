# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/aws/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-aws"
  spec.version       = Fog::AWS::VERSION
  spec.authors       = ["Josh Lane", "Wesley Beary"]
  spec.email         = ["me@joshualane.com", "geemus@gmail.com"]
  spec.summary       = %q{Module for the 'fog' gem to support Amazon Web Services.}
  spec.description   = %q{This library can be used as a module for `fog` or as standalone provider
                        to use the Amazon Web Services in applications..}
  spec.homepage      = "https://github.com/fog/fog-aws"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency 'bundler', '~> 1.6'
  spec.add_development_dependency 'rake',    '~> 10.0'
  spec.add_development_dependency 'shindo',  '~> 0.3'
  spec.add_development_dependency 'rubyzip', '~> 0.9.9'

  spec.add_dependency 'fog-core',  '~> 1.38'
  spec.add_dependency 'fog-json',  '~> 1.0'
  spec.add_dependency 'fog-xml',   '~> 0.1'
  spec.add_dependency 'ipaddress', '~> 0.8'
end
