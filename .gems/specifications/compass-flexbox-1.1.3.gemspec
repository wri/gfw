# -*- encoding: utf-8 -*-
# stub: compass-flexbox 1.1.3 ruby lib

Gem::Specification.new do |s|
  s.name = "compass-flexbox".freeze
  s.version = "1.1.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Tim Hettler".freeze]
  s.date = "2013-12-04"
  s.description = "A compass extension that provides variables & mixins for the latest Flexible Box Layout (flexbox) specification".freeze
  s.email = ["me+github@timhettler.com".freeze]
  s.homepage = "https://github.com/timhettler/compass-flexbox".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "A compass extension that provides variables & mixins for the latest Flexible Box Layout (flexbox) specification".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<sass>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<compass>.freeze, [">= 0"])
    else
      s.add_dependency(%q<sass>.freeze, [">= 0"])
      s.add_dependency(%q<compass>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<sass>.freeze, [">= 0"])
    s.add_dependency(%q<compass>.freeze, [">= 0"])
  end
end
