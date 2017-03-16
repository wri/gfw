# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/xenserver/version'

Gem::Specification.new do |spec|
  spec.name          = 'fog-xenserver'
  spec.version       = Fog::XenServer::VERSION
  spec.authors       = %q(Paulo Henrique Lopes Ribeiro)
  spec.email         = %q(plribeiro3000@gmail.com)
  spec.description   = %q{Module for the 'fog' gem to support XENSERVER.}
  spec.summary       = %q{This library can be used as a module for `fog` or as standalone provider
                        to use the XENSERVER in applications.}
  spec.homepage      = 'https://github.com/fog/fog-xenserver'
  spec.license       = 'MIT'

  files              = `git ls-files -z`.split("\x0")
  files.delete(".hound.yml")
  spec.files = files

  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = %w(lib)

  spec.add_dependency 'fog-xml'
  spec.add_dependency 'fog-core'
  spec.add_dependency 'xmlrpc' if RUBY_VERSION =~ /^2\.[^0-3].*$/

  spec.add_development_dependency 'coveralls'
  spec.add_development_dependency 'json' if RUBY_VERSION =~ /^1\.8.*$/
  spec.add_development_dependency 'minitest'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'pry'
  spec.add_development_dependency 'turn'
  spec.add_development_dependency 'webmock'

  if RUBY_VERSION =~ /^1\.(8.*|9.[0-2])$/
    spec.add_development_dependency 'vcr', '< 3.0.0'
  else
    spec.add_development_dependency 'vcr'
  end
end
