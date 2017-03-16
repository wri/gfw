# -*- encoding: utf-8 -*-
# stub: fission 0.5.0 ruby lib

Gem::Specification.new do |s|
  s.name = "fission".freeze
  s.version = "0.5.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Tommy Bishop".freeze]
  s.date = "2013-10-05"
  s.description = "A simple utility to manage VMware Fusion VMs from the command line".freeze
  s.email = ["bishop.thomas@gmail.com".freeze]
  s.executables = ["fission".freeze]
  s.files = ["bin/fission".freeze]
  s.homepage = "https://github.com/thbishop/fission".freeze
  s.rubyforge_project = "fission".freeze
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Command line tool to manage VMware Fusion VMs".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<CFPropertyList>.freeze, ["~> 2.2"])
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
      s.add_development_dependency(%q<fakefs>.freeze, ["~> 0.4.3"])
      s.add_development_dependency(%q<rspec>.freeze, ["~> 2.14"])
    else
      s.add_dependency(%q<CFPropertyList>.freeze, ["~> 2.2"])
      s.add_dependency(%q<rake>.freeze, [">= 0"])
      s.add_dependency(%q<fakefs>.freeze, ["~> 0.4.3"])
      s.add_dependency(%q<rspec>.freeze, ["~> 2.14"])
    end
  else
    s.add_dependency(%q<CFPropertyList>.freeze, ["~> 2.2"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<fakefs>.freeze, ["~> 0.4.3"])
    s.add_dependency(%q<rspec>.freeze, ["~> 2.14"])
  end
end
