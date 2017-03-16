# -*- encoding: utf-8 -*-
# stub: fog-rackspace 0.1.4 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-rackspace".freeze
  s.version = "0.1.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Matt Darby".freeze]
  s.bindir = "exe".freeze
  s.date = "2017-01-16"
  s.description = "Rackspace provider gem for Fog".freeze
  s.email = ["matt.darby@rackspace.com".freeze]
  s.homepage = "http://developer.rackspace.com".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Rackspace support for Fog".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_development_dependency(%q<rspec>.freeze, ["~> 3.4"])
      s.add_development_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
      s.add_development_dependency(%q<pry>.freeze, ["~> 0.10.3"])
      s.add_development_dependency(%q<vcr>.freeze, ["~> 3.0.1"])
      s.add_development_dependency(%q<webmock>.freeze, ["~> 1.24.2"])
      s.add_development_dependency(%q<mime-types>.freeze, [">= 0"])
      s.add_development_dependency(%q<mime-types-data>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<fog-core>.freeze, [">= 1.35"])
      s.add_runtime_dependency(%q<fog-json>.freeze, [">= 1.0"])
      s.add_runtime_dependency(%q<fog-xml>.freeze, [">= 0.1"])
      s.add_runtime_dependency(%q<ipaddress>.freeze, [">= 0.8"])
    else
      s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_dependency(%q<rspec>.freeze, ["~> 3.4"])
      s.add_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
      s.add_dependency(%q<pry>.freeze, ["~> 0.10.3"])
      s.add_dependency(%q<vcr>.freeze, ["~> 3.0.1"])
      s.add_dependency(%q<webmock>.freeze, ["~> 1.24.2"])
      s.add_dependency(%q<mime-types>.freeze, [">= 0"])
      s.add_dependency(%q<mime-types-data>.freeze, [">= 0"])
      s.add_dependency(%q<fog-core>.freeze, [">= 1.35"])
      s.add_dependency(%q<fog-json>.freeze, [">= 1.0"])
      s.add_dependency(%q<fog-xml>.freeze, [">= 0.1"])
      s.add_dependency(%q<ipaddress>.freeze, [">= 0.8"])
    end
  else
    s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.4"])
    s.add_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
    s.add_dependency(%q<pry>.freeze, ["~> 0.10.3"])
    s.add_dependency(%q<vcr>.freeze, ["~> 3.0.1"])
    s.add_dependency(%q<webmock>.freeze, ["~> 1.24.2"])
    s.add_dependency(%q<mime-types>.freeze, [">= 0"])
    s.add_dependency(%q<mime-types-data>.freeze, [">= 0"])
    s.add_dependency(%q<fog-core>.freeze, [">= 1.35"])
    s.add_dependency(%q<fog-json>.freeze, [">= 1.0"])
    s.add_dependency(%q<fog-xml>.freeze, [">= 0.1"])
    s.add_dependency(%q<ipaddress>.freeze, [">= 0.8"])
  end
end
