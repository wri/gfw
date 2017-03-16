# -*- encoding: utf-8 -*-
# stub: sprockets 2.12.4 ruby lib

Gem::Specification.new do |s|
  s.name = "sprockets".freeze
  s.version = "2.12.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Sam Stephenson".freeze, "Joshua Peek".freeze]
  s.date = "2015-06-26"
  s.description = "Sprockets is a Rack-based asset packaging system that concatenates and serves JavaScript, CoffeeScript, CSS, LESS, Sass, and SCSS.".freeze
  s.email = ["sstephenson@gmail.com".freeze, "josh@joshpeek.com".freeze]
  s.executables = ["sprockets".freeze]
  s.files = ["bin/sprockets".freeze]
  s.homepage = "http://getsprockets.org/".freeze
  s.licenses = ["MIT".freeze]
  s.rubyforge_project = "sprockets".freeze
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Rack-based asset packaging system".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<hike>.freeze, ["~> 1.2"])
      s.add_runtime_dependency(%q<multi_json>.freeze, ["~> 1.0"])
      s.add_runtime_dependency(%q<rack>.freeze, ["~> 1.0"])
      s.add_runtime_dependency(%q<tilt>.freeze, ["!= 1.3.0", "~> 1.1"])
      s.add_development_dependency(%q<closure-compiler>.freeze, [">= 0"])
      s.add_development_dependency(%q<coffee-script>.freeze, ["~> 2.0"])
      s.add_development_dependency(%q<coffee-script-source>.freeze, ["~> 1.2"])
      s.add_development_dependency(%q<eco>.freeze, ["~> 1.0"])
      s.add_development_dependency(%q<ejs>.freeze, ["~> 1.0"])
      s.add_development_dependency(%q<execjs>.freeze, ["~> 1.0"])
      s.add_development_dependency(%q<json>.freeze, [">= 0"])
      s.add_development_dependency(%q<rack-test>.freeze, [">= 0"])
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
      s.add_development_dependency(%q<sass>.freeze, ["~> 3.1"])
      s.add_development_dependency(%q<uglifier>.freeze, [">= 0"])
      s.add_development_dependency(%q<yui-compressor>.freeze, [">= 0"])
    else
      s.add_dependency(%q<hike>.freeze, ["~> 1.2"])
      s.add_dependency(%q<multi_json>.freeze, ["~> 1.0"])
      s.add_dependency(%q<rack>.freeze, ["~> 1.0"])
      s.add_dependency(%q<tilt>.freeze, ["!= 1.3.0", "~> 1.1"])
      s.add_dependency(%q<closure-compiler>.freeze, [">= 0"])
      s.add_dependency(%q<coffee-script>.freeze, ["~> 2.0"])
      s.add_dependency(%q<coffee-script-source>.freeze, ["~> 1.2"])
      s.add_dependency(%q<eco>.freeze, ["~> 1.0"])
      s.add_dependency(%q<ejs>.freeze, ["~> 1.0"])
      s.add_dependency(%q<execjs>.freeze, ["~> 1.0"])
      s.add_dependency(%q<json>.freeze, [">= 0"])
      s.add_dependency(%q<rack-test>.freeze, [">= 0"])
      s.add_dependency(%q<rake>.freeze, [">= 0"])
      s.add_dependency(%q<sass>.freeze, ["~> 3.1"])
      s.add_dependency(%q<uglifier>.freeze, [">= 0"])
      s.add_dependency(%q<yui-compressor>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<hike>.freeze, ["~> 1.2"])
    s.add_dependency(%q<multi_json>.freeze, ["~> 1.0"])
    s.add_dependency(%q<rack>.freeze, ["~> 1.0"])
    s.add_dependency(%q<tilt>.freeze, ["!= 1.3.0", "~> 1.1"])
    s.add_dependency(%q<closure-compiler>.freeze, [">= 0"])
    s.add_dependency(%q<coffee-script>.freeze, ["~> 2.0"])
    s.add_dependency(%q<coffee-script-source>.freeze, ["~> 1.2"])
    s.add_dependency(%q<eco>.freeze, ["~> 1.0"])
    s.add_dependency(%q<ejs>.freeze, ["~> 1.0"])
    s.add_dependency(%q<execjs>.freeze, ["~> 1.0"])
    s.add_dependency(%q<json>.freeze, [">= 0"])
    s.add_dependency(%q<rack-test>.freeze, [">= 0"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<sass>.freeze, ["~> 3.1"])
    s.add_dependency(%q<uglifier>.freeze, [">= 0"])
    s.add_dependency(%q<yui-compressor>.freeze, [">= 0"])
  end
end
