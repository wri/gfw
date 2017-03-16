# -*- encoding: utf-8 -*-
# stub: requirejs-rails 0.9.5 ruby lib

Gem::Specification.new do |s|
  s.name = "requirejs-rails".freeze
  s.version = "0.9.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["John Whitley".freeze]
  s.date = "2014-09-18"
  s.description = "This gem provides RequireJS support for your Rails 3 application.".freeze
  s.email = ["whitley@bangpath.org".freeze]
  s.homepage = "http://github.com/jwhitley/requirejs-rails".freeze
  s.requirements = ["node.js is required for 'rake assets:precompile', used to run the r.js build".freeze, "If needed, jQuery should be v1.7 or greater (jquery-rails >= 1.0.17).".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Use RequireJS with the Rails 3+ Asset Pipeline".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<railties>.freeze, [">= 3.1.1"])
      s.add_development_dependency(%q<rails>.freeze, [">= 3.1.1"])
      s.add_development_dependency(%q<sqlite3>.freeze, [">= 0"])
    else
      s.add_dependency(%q<railties>.freeze, [">= 3.1.1"])
      s.add_dependency(%q<rails>.freeze, [">= 3.1.1"])
      s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<railties>.freeze, [">= 3.1.1"])
    s.add_dependency(%q<rails>.freeze, [">= 3.1.1"])
    s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
  end
end
