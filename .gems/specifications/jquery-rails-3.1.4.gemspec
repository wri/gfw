# -*- encoding: utf-8 -*-
# stub: jquery-rails 3.1.4 ruby lib

Gem::Specification.new do |s|
  s.name = "jquery-rails".freeze
  s.version = "3.1.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Andr\u{e9} Arko".freeze]
  s.date = "2015-09-01"
  s.description = "This gem provides jQuery and the jQuery-ujs driver for your Rails 3+ application.".freeze
  s.email = ["andre@arko.net".freeze]
  s.homepage = "http://rubygems.org/gems/jquery-rails".freeze
  s.licenses = ["MIT".freeze]
  s.rubyforge_project = "jquery-rails".freeze
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Use jQuery with Rails 3+".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<railties>.freeze, ["< 5.0", ">= 3.0"])
      s.add_runtime_dependency(%q<thor>.freeze, ["< 2.0", ">= 0.14"])
    else
      s.add_dependency(%q<railties>.freeze, ["< 5.0", ">= 3.0"])
      s.add_dependency(%q<thor>.freeze, ["< 2.0", ">= 0.14"])
    end
  else
    s.add_dependency(%q<railties>.freeze, ["< 5.0", ">= 3.0"])
    s.add_dependency(%q<thor>.freeze, ["< 2.0", ">= 0.14"])
  end
end
