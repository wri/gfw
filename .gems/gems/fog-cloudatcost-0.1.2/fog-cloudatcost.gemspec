lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fog/cloudatcost/version'


Gem::Specification.new do |spec|
  spec.name          = 'fog-cloudatcost'
  spec.version       = Fog::CloudAtCost::VERSION
  spec.authors       = ["Suraj Shirvankar"]
  spec.email         = ["surajshirvankar@gmail.com"]
  spec.summary       = %q{Module for the 'fog' gem to support CloudAtCost.}
  spec.description   = %q{This library can be used as a module for `fog` or as standalone provider
                                      to use the Amazon Web Services in applications..}
  spec.homepage      = 'http://github.com/fog/fog-cloudatcost'
  spec.license       = 'MIT'

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency 'bundler', '~> 1.6'
  spec.add_development_dependency 'rake',    '~> 10.0'
  spec.add_development_dependency 'rspec',  '~> 3.4.0'
  spec.add_development_dependency 'rubyzip', '~> 1.1.0'

  spec.add_dependency 'fog-core',  '~> 1.36'
  spec.add_dependency 'fog-json',  '~> 1.0'
  spec.add_dependency 'fog-xml',   '~> 0.1'
  spec.add_dependency 'ipaddress', '~> 0.8'
end

