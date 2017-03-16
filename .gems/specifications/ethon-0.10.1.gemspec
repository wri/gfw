# -*- encoding: utf-8 -*-
# stub: ethon 0.10.1 ruby lib

Gem::Specification.new do |s|
  s.name = "ethon".freeze
  s.version = "0.10.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Hans Hasselberg".freeze]
  s.date = "2016-12-02"
  s.description = "Very lightweight libcurl wrapper.".freeze
  s.email = ["me@hans.io".freeze]
  s.homepage = "https://github.com/typhoeus/ethon".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Libcurl wrapper.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<ffi>.freeze, [">= 1.3.0"])
    else
      s.add_dependency(%q<ffi>.freeze, [">= 1.3.0"])
    end
  else
    s.add_dependency(%q<ffi>.freeze, [">= 1.3.0"])
  end
end
