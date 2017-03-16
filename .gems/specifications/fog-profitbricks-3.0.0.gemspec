# -*- encoding: utf-8 -*-
# stub: fog-profitbricks 3.0.0 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-profitbricks".freeze
  s.version = "3.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Ethan Devenport".freeze]
  s.date = "2016-11-10"
  s.description = "This library can be used as a module for 'fog' or as\n                        standalone ProfitBricks provider.".freeze
  s.email = ["ethand@stackpointcloud.com".freeze]
  s.homepage = "https://github.com/fog/fog-profitbricks".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Module for the 'fog' gem to support ProfitBricks.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<fog-core>.freeze, ["~> 1.42"])
      s.add_runtime_dependency(%q<fog-json>.freeze, ["~> 1.0"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.4"])
      s.add_development_dependency(%q<minitest>.freeze, ["~> 4"])
      s.add_development_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_development_dependency(%q<turn>.freeze, ["~> 0.9"])
      s.add_development_dependency(%q<pry>.freeze, ["~> 0.10"])
      s.add_development_dependency(%q<rubocop>.freeze, [">= 0"])
    else
      s.add_dependency(%q<fog-core>.freeze, ["~> 1.42"])
      s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.4"])
      s.add_dependency(%q<minitest>.freeze, ["~> 4"])
      s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_dependency(%q<turn>.freeze, ["~> 0.9"])
      s.add_dependency(%q<pry>.freeze, ["~> 0.10"])
      s.add_dependency(%q<rubocop>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<fog-core>.freeze, ["~> 1.42"])
    s.add_dependency(%q<fog-json>.freeze, ["~> 1.0"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.4"])
    s.add_dependency(%q<minitest>.freeze, ["~> 4"])
    s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
    s.add_dependency(%q<turn>.freeze, ["~> 0.9"])
    s.add_dependency(%q<pry>.freeze, ["~> 0.10"])
    s.add_dependency(%q<rubocop>.freeze, [">= 0"])
  end
end
