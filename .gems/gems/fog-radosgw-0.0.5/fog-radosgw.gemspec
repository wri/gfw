# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/radosgw/version'

Gem::Specification.new do |s|
  s.name          = 'fog-radosgw'
  s.version       = Fog::Radosgw::VERSION
  s.authors       = %q(Jon Kåre Hellan)
  s.email         = %q(hellan@acm.org)
  s.summary       = %q{Fog backend for provisioning Ceph Radosgw.}
  s.description   = %q{Fog backend for provisioning users on Ceph Radosgw - the Swift and S3 compatible REST API for Ceph.}
  s.homepage      = 'https://github.com/fog/fog-radosgw'
  s.license       = 'MIT'

  s.files         = `git ls-files -z`.split("\x0")
  s.executables   = s.files.grep(%r{^bin/}) { |f| File.basename(f) }
  s.test_files    = s.files.grep(%r{^(test|spec|features)/})
  s.require_paths = %w(lib)

  s.rdoc_options = ["--charset=UTF-8"]
  s.extra_rdoc_files = %w[README.md LICENSE.md]

  s.add_dependency 'fog-json'
  s.add_dependency 'fog-xml', '>=0.0.1'
  s.add_dependency 'fog-core', '>=1.21.0'
  s.add_development_dependency 'rake'
  s.add_development_dependency 'yard'
  s.add_development_dependency 'shindo'
end
