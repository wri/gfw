# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "fission/version"

Gem::Specification.new do |s|
  s.name        = "fission"
  s.version     = Fission::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ['Tommy Bishop']
  s.email       = ['bishop.thomas@gmail.com']
  s.homepage    = "https://github.com/thbishop/fission"
  s.summary     = %q{Command line tool to manage VMware Fusion VMs}
  s.description = %q{A simple utility to manage VMware Fusion VMs from the command line}

  s.rubyforge_project = "fission"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
  s.add_dependency 'CFPropertyList', '~> 2.2'
  s.add_development_dependency 'rake'
  s.add_development_dependency 'fakefs', '~> 0.4.3'
  s.add_development_dependency 'rspec', '~> 2.14'
end
