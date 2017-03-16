# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/vmfusion/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-vmfusion"
  spec.version       = Fog::Vmfusion::VERSION
  spec.authors       = %q(Paulo Henrique Lopes Ribeiro)
  spec.email         = %q(plribeiro3000@gmail.com)
  spec.summary       = %q{Module for the 'fog' gem to support VMWARE FUSION.}
  spec.description   = %q{This library can be used as a module for `fog` or as standalone provider
                        to use the VMWARE FUSION in applications.}
  spec.homepage      = ""
  spec.license       = "MIT"

  files              = `git ls-files -z`.split("\x0")
  files.delete(".hound.yml")
  spec.files         = files

  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency "fog-core"
  spec.add_dependency "fission"

  spec.add_development_dependency "rake"
  spec.add_development_dependency "minitest"
  spec.add_development_dependency "turn"
  spec.add_development_dependency "pry"

  if RUBY_VERSION.to_f > 1.9
    spec.add_development_dependency "coveralls"
    spec.add_development_dependency "rubocop"
  end
end
