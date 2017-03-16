# -*- encoding: utf-8 -*-
# stub: fog-dnsimple 1.0.0 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-dnsimple".freeze
  s.version = "1.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Simone Carletti".freeze]
  s.date = "2016-07-11"
  s.description = "This library can be used as a module for `fog` or as standalone provider\n                        to use the DNSimple in applications.".freeze
  s.email = ["weppos@weppos.net".freeze]
  s.executables = ["console".freeze, "setup".freeze]
  s.files = ["bin/console".freeze, "bin/setup".freeze]
  s.homepage = "https://github.com/fog/fog-dnsimple".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Module for the 'fog' gem to support DNSimple.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.12"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_runtime_dependency(%q<fog-core>.freeze, ["~> 1.38"])
      s.add_runtime_dependency(%q<fog-json>.freeze, ["~> 1.0"])
    else
      s.add_dependency(%q<bundler>.freeze, ["~> 1.12"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_dependency(%q<fog-core>.freeze, ["~> 1.38"])
      s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
    end
  else
    s.add_dependency(%q<bundler>.freeze, ["~> 1.12"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
    s.add_dependency(%q<fog-core>.freeze, ["~> 1.38"])
    s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
  end
end
