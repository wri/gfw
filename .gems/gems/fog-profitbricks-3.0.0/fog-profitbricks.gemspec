# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/profitbricks/version'

Gem::Specification.new do |spec|
  spec.name          = "fog-profitbricks"
  spec.version       = Fog::ProfitBricks::VERSION
  spec.authors       = ["Ethan Devenport"]
  spec.email         = ["ethand@stackpointcloud.com"]
  spec.summary       = "Module for the 'fog' gem to support ProfitBricks."
  spec.description   = "This library can be used as a module for 'fog' or as
                        standalone ProfitBricks provider."
  spec.homepage      = "https://github.com/fog/fog-profitbricks"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_runtime_dependency "fog-core", "~> 1.42"
  spec.add_runtime_dependency "fog-json", "~> 1.0"

  spec.add_development_dependency "rake", "~> 10.4"
  spec.add_development_dependency "minitest", "~> 4"
  spec.add_development_dependency "shindo", "~> 0.3"
  spec.add_development_dependency "turn", "~> 0.9"
  spec.add_development_dependency "pry", "~> 0.10"
  spec.add_development_dependency "rubocop" if RUBY_VERSION >= "2.0.0"
end
