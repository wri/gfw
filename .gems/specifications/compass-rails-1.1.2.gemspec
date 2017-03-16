# -*- encoding: utf-8 -*-
# stub: compass-rails 1.1.2 ruby lib

Gem::Specification.new do |s|
  s.name = "compass-rails".freeze
  s.version = "1.1.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Scott Davis".freeze, "Chris Eppstein".freeze, "Craig McNamara".freeze]
  s.date = "2013-12-06"
  s.description = "Integrate Compass into Rails 3.0 and up.".freeze
  s.email = ["jetviper21@gmail.com".freeze, "chris@eppsteins.net".freeze, "craig.mcnamara@gmail.com".freeze]
  s.homepage = "https://github.com/Compass/compass-rails".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Integrate Compass into Rails 3.0 and up.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<compass>.freeze, [">= 0.12.2"])
    else
      s.add_dependency(%q<compass>.freeze, [">= 0.12.2"])
    end
  else
    s.add_dependency(%q<compass>.freeze, [">= 0.12.2"])
  end
end
