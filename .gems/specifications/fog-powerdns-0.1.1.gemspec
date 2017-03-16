# -*- encoding: utf-8 -*-
# stub: fog-powerdns 0.1.1 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-powerdns".freeze
  s.version = "0.1.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Chris Luo".freeze]
  s.bindir = "exe".freeze
  s.date = "2015-03-16"
  s.description = "This library can be used as a module for 'fog' or as a standalone provider to use PowerDNS DNS services in applications.".freeze
  s.email = ["luo_christopher@bah.com".freeze]
  s.homepage = "http://github.com/cluobah/fog-powerdns".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Module for the 'fog' gem to support PowerDNS DNS services.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.8"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_runtime_dependency(%q<fog-core>.freeze, ["~> 1.27"])
      s.add_runtime_dependency(%q<fog-json>.freeze, ["~> 1.0"])
      s.add_runtime_dependency(%q<fog-xml>.freeze, ["~> 0.1"])
    else
      s.add_dependency(%q<bundler>.freeze, ["~> 1.8"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<fog-core>.freeze, ["~> 1.27"])
      s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
      s.add_dependency(%q<fog-xml>.freeze, ["~> 0.1"])
    end
  else
    s.add_dependency(%q<bundler>.freeze, ["~> 1.8"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<fog-core>.freeze, ["~> 1.27"])
    s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
    s.add_dependency(%q<fog-xml>.freeze, ["~> 0.1"])
  end
end
