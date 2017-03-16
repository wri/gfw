# -*- encoding: utf-8 -*-
# stub: rack-reverse-proxy 0.11.0 ruby lib

Gem::Specification.new do |s|
  s.name = "rack-reverse-proxy".freeze
  s.version = "0.11.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Jon Swope".freeze, "Ian Ehlert".freeze, "Roman Ernst".freeze, "Oleksii Fedorov".freeze]
  s.date = "2016-03-02"
  s.description = "A Rack based reverse proxy for basic needs.\nUseful for testing or in cases where webserver configuration is unavailable.\n".freeze
  s.email = ["jaswope@gmail.com".freeze, "ehlertij@gmail.com".freeze, "rernst@farbenmeer.net".freeze, "waterlink000@gmail.com".freeze]
  s.homepage = "https://github.com/waterlink/rack-reverse-proxy".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "A Simple Reverse Proxy for Rack".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<rack>.freeze, [">= 1.0.0"])
      s.add_runtime_dependency(%q<rack-proxy>.freeze, [">= 0.5.14", "~> 0.5"])
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.7"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.3"])
    else
      s.add_dependency(%q<rack>.freeze, [">= 1.0.0"])
      s.add_dependency(%q<rack-proxy>.freeze, [">= 0.5.14", "~> 0.5"])
      s.add_dependency(%q<bundler>.freeze, ["~> 1.7"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.3"])
    end
  else
    s.add_dependency(%q<rack>.freeze, [">= 1.0.0"])
    s.add_dependency(%q<rack-proxy>.freeze, [">= 0.5.14", "~> 0.5"])
    s.add_dependency(%q<bundler>.freeze, ["~> 1.7"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.3"])
  end
end
