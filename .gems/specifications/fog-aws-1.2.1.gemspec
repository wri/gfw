# -*- encoding: utf-8 -*-
# stub: fog-aws 1.2.1 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-aws".freeze
  s.version = "1.2.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Josh Lane".freeze, "Wesley Beary".freeze]
  s.date = "2017-02-27"
  s.description = "This library can be used as a module for `fog` or as standalone provider\n                        to use the Amazon Web Services in applications..".freeze
  s.email = ["me@joshualane.com".freeze, "geemus@gmail.com".freeze]
  s.homepage = "https://github.com/fog/fog-aws".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Module for the 'fog' gem to support Amazon Web Services.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_development_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
      s.add_runtime_dependency(%q<fog-core>.freeze, ["~> 1.38"])
      s.add_runtime_dependency(%q<fog-json>.freeze, ["~> 1.0"])
      s.add_runtime_dependency(%q<fog-xml>.freeze, ["~> 0.1"])
      s.add_runtime_dependency(%q<ipaddress>.freeze, ["~> 0.8"])
    else
      s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
      s.add_dependency(%q<fog-core>.freeze, ["~> 1.38"])
      s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
      s.add_dependency(%q<fog-xml>.freeze, ["~> 0.1"])
      s.add_dependency(%q<ipaddress>.freeze, ["~> 0.8"])
    end
  else
    s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
    s.add_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
    s.add_dependency(%q<fog-core>.freeze, ["~> 1.38"])
    s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
    s.add_dependency(%q<fog-xml>.freeze, ["~> 0.1"])
    s.add_dependency(%q<ipaddress>.freeze, ["~> 0.8"])
  end
end
