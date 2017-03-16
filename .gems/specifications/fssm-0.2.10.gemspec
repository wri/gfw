# -*- encoding: utf-8 -*-
# stub: fssm 0.2.10 ruby lib

Gem::Specification.new do |s|
  s.name = "fssm".freeze
  s.version = "0.2.10"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Travis Tilley".freeze, "Nathan Weizenbaum".freeze, "Chris Eppstein".freeze, "Jonathan Castello".freeze, "Tuomas Kareinen".freeze]
  s.date = "2013-01-27"
  s.description = "The File System State Monitor keeps track of the state of any number of paths and will fire events when said state changes (create/update/delete). FSSM supports using FSEvents on MacOS, Inotify on GNU/Linux, and polling anywhere else.".freeze
  s.email = ["ttilley@gmail.com".freeze]
  s.homepage = "https://github.com/ttilley/fssm".freeze
  s.rubyforge_project = "fssm".freeze
  s.rubygems_version = "2.6.10".freeze
  s.summary = "File System State Monitor".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
      s.add_development_dependency(%q<rspec>.freeze, [">= 2.4.0"])
    else
      s.add_dependency(%q<rake>.freeze, [">= 0"])
      s.add_dependency(%q<rspec>.freeze, [">= 2.4.0"])
    end
  else
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<rspec>.freeze, [">= 2.4.0"])
  end
end
