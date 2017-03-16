# -*- encoding: utf-8 -*-
# stub: fog-digitalocean 0.3.0 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-digitalocean".freeze
  s.version = "0.3.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["JJ Asghar".freeze, "Suraj Shirvankar".freeze]
  s.date = "2016-03-30"
  s.description = "DigitalOcean fog provider gem".freeze
  s.email = ["jj@chef.io".freeze, "surajshirvankar@gmail.com".freeze]
  s.extra_rdoc_files = ["README.md".freeze]
  s.files = ["README.md".freeze]
  s.homepage = "http://github.com/fog/fog-digitalocean".freeze
  s.licenses = ["MIT".freeze]
  s.rdoc_options = ["--charset=UTF-8".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "DigitalOcean fog provider gem".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 2

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_development_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
      s.add_development_dependency(%q<mime-types>.freeze, [">= 0"])
      s.add_development_dependency(%q<mime-types-data>.freeze, [">= 0"])
      s.add_development_dependency(%q<rubocop>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<fog-core>.freeze, ["~> 1.42"])
      s.add_runtime_dependency(%q<fog-json>.freeze, [">= 1.0"])
      s.add_runtime_dependency(%q<fog-xml>.freeze, [">= 0.1"])
      s.add_runtime_dependency(%q<ipaddress>.freeze, [">= 0.5"])
    else
      s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
      s.add_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
      s.add_dependency(%q<mime-types>.freeze, [">= 0"])
      s.add_dependency(%q<mime-types-data>.freeze, [">= 0"])
      s.add_dependency(%q<rubocop>.freeze, [">= 0"])
      s.add_dependency(%q<fog-core>.freeze, ["~> 1.42"])
      s.add_dependency(%q<fog-json>.freeze, [">= 1.0"])
      s.add_dependency(%q<fog-xml>.freeze, [">= 0.1"])
      s.add_dependency(%q<ipaddress>.freeze, [">= 0.5"])
    end
  else
    s.add_dependency(%q<bundler>.freeze, ["~> 1.6"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<shindo>.freeze, ["~> 0.3"])
    s.add_dependency(%q<rubyzip>.freeze, ["~> 0.9.9"])
    s.add_dependency(%q<mime-types>.freeze, [">= 0"])
    s.add_dependency(%q<mime-types-data>.freeze, [">= 0"])
    s.add_dependency(%q<rubocop>.freeze, [">= 0"])
    s.add_dependency(%q<fog-core>.freeze, ["~> 1.42"])
    s.add_dependency(%q<fog-json>.freeze, [">= 1.0"])
    s.add_dependency(%q<fog-xml>.freeze, [">= 0.1"])
    s.add_dependency(%q<ipaddress>.freeze, [">= 0.5"])
  end
end
