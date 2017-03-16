# -*- encoding: utf-8 -*-
# stub: sass-rails 4.0.5 ruby lib

Gem::Specification.new do |s|
  s.name = "sass-rails".freeze
  s.version = "4.0.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["wycats".freeze, "chriseppstein".freeze]
  s.date = "2014-11-25"
  s.description = "Sass adapter for the Rails asset pipeline.".freeze
  s.email = ["wycats@gmail.com".freeze, "chris@eppsteins.net".freeze]
  s.homepage = "https://github.com/rails/sass-rails".freeze
  s.licenses = ["MIT".freeze]
  s.rubyforge_project = "sass-rails".freeze
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Sass adapter for the Rails asset pipeline.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<railties>.freeze, ["< 5.0", ">= 4.0.0"])
      s.add_runtime_dependency(%q<sass>.freeze, ["~> 3.2.2"])
      s.add_runtime_dependency(%q<sprockets-rails>.freeze, ["~> 2.0"])
      s.add_runtime_dependency(%q<sprockets>.freeze, ["< 3.0", "~> 2.8"])
      s.add_development_dependency(%q<rails>.freeze, [">= 0"])
      s.add_development_dependency(%q<sqlite3>.freeze, [">= 0"])
    else
      s.add_dependency(%q<railties>.freeze, ["< 5.0", ">= 4.0.0"])
      s.add_dependency(%q<sass>.freeze, ["~> 3.2.2"])
      s.add_dependency(%q<sprockets-rails>.freeze, ["~> 2.0"])
      s.add_dependency(%q<sprockets>.freeze, ["< 3.0", "~> 2.8"])
      s.add_dependency(%q<rails>.freeze, [">= 0"])
      s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<railties>.freeze, ["< 5.0", ">= 4.0.0"])
    s.add_dependency(%q<sass>.freeze, ["~> 3.2.2"])
    s.add_dependency(%q<sprockets-rails>.freeze, ["~> 2.0"])
    s.add_dependency(%q<sprockets>.freeze, ["< 3.0", "~> 2.8"])
    s.add_dependency(%q<rails>.freeze, [">= 0"])
    s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
  end
end
