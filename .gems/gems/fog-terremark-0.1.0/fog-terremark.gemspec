# coding: utf-8
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "fog/terremark/version"

Gem::Specification.new do |spec|
  spec.name          = "fog-terremark"
  spec.version       = Fog::Terremark::VERSION
  spec.authors       = ["Paulo Henrique Lopes Ribeiro"]
  spec.email         = ["plribeiro3000@gmail.com"]
  spec.summary       = "Module for the 'fog' gem to support Terremark vCloud."
  spec.description   = <<-EOS
                         This library can be used as a module for `fog` or
                         as standalone provider to use the Terremark vCloud in
                         applications.
                       EOS
  spec.homepage      = ""
  spec.license       = "MIT"

  files              = `git ls-files -z`.split("\x0")
  files.delete(".hound.yml")
  spec.files         = files
  
  spec.executables   = spec.files.grep(/^bin\//) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(/^(test|spec|features)\//)
  spec.require_paths = ["lib"]

  spec.add_dependency "fog-core"
  spec.add_dependency "fog-xml"

  spec.add_development_dependency "rake"
  spec.add_development_dependency "minitest"
  spec.add_development_dependency "turn"
  spec.add_development_dependency "pry"
  spec.add_development_dependency "vcr"

  if RUBY_VERSION.to_f > 1.9
    spec.add_development_dependency "coveralls"
    spec.add_development_dependency "rubocop"
  end
end
