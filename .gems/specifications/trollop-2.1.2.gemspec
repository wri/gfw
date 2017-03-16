# -*- encoding: utf-8 -*-
# stub: trollop 2.1.2 ruby lib

Gem::Specification.new do |s|
  s.name = "trollop".freeze
  s.version = "2.1.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["William Morgan".freeze, "Keenan Brock".freeze]
  s.date = "2015-03-11"
  s.description = "Trollop is a commandline option parser for Ruby that just\ngets out of your way. One line of code per option is all you need to write.\nFor that, you get a nice automatically-generated help page, robust option\nparsing, command subcompletion, and sensible defaults for everything you don't\nspecify.".freeze
  s.email = "keenan@thebrocks.net".freeze
  s.homepage = "http://manageiq.github.io/trollop/".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Trollop is a commandline option parser for Ruby that just gets out of your way.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<minitest>.freeze, ["~> 4.7.3"])
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<chronic>.freeze, [">= 0"])
      s.add_development_dependency(%q<coveralls>.freeze, [">= 0"])
      s.add_development_dependency(%q<mime-types>.freeze, [">= 0"])
    else
      s.add_dependency(%q<minitest>.freeze, ["~> 4.7.3"])
      s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<chronic>.freeze, [">= 0"])
      s.add_dependency(%q<coveralls>.freeze, [">= 0"])
      s.add_dependency(%q<mime-types>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<minitest>.freeze, ["~> 4.7.3"])
    s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<chronic>.freeze, [">= 0"])
    s.add_dependency(%q<coveralls>.freeze, [">= 0"])
    s.add_dependency(%q<mime-types>.freeze, [">= 0"])
  end
end
