# -*- encoding: utf-8 -*-
# stub: fog-radosgw 0.0.5 ruby lib

Gem::Specification.new do |s|
  s.name = "fog-radosgw".freeze
  s.version = "0.0.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Jon K\u{e5}re Hellan".freeze]
  s.date = "2016-01-10"
  s.description = "Fog backend for provisioning users on Ceph Radosgw - the Swift and S3 compatible REST API for Ceph.".freeze
  s.email = "hellan@acm.org".freeze
  s.extra_rdoc_files = ["README.md".freeze, "LICENSE.md".freeze]
  s.files = ["LICENSE.md".freeze, "README.md".freeze]
  s.homepage = "https://github.com/fog/fog-radosgw".freeze
  s.licenses = ["MIT".freeze]
  s.rdoc_options = ["--charset=UTF-8".freeze]
  s.rubygems_version = "2.6.10".freeze
  s.summary = "Fog backend for provisioning Ceph Radosgw.".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<fog-json>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<fog-xml>.freeze, [">= 0.0.1"])
      s.add_runtime_dependency(%q<fog-core>.freeze, [">= 1.21.0"])
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
      s.add_development_dependency(%q<yard>.freeze, [">= 0"])
      s.add_development_dependency(%q<shindo>.freeze, [">= 0"])
    else
      s.add_dependency(%q<fog-json>.freeze, [">= 0"])
      s.add_dependency(%q<fog-xml>.freeze, [">= 0.0.1"])
      s.add_dependency(%q<fog-core>.freeze, [">= 1.21.0"])
      s.add_dependency(%q<rake>.freeze, [">= 0"])
      s.add_dependency(%q<yard>.freeze, [">= 0"])
      s.add_dependency(%q<shindo>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<fog-json>.freeze, [">= 0"])
    s.add_dependency(%q<fog-xml>.freeze, [">= 0.0.1"])
    s.add_dependency(%q<fog-core>.freeze, [">= 1.21.0"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<yard>.freeze, [">= 0"])
    s.add_dependency(%q<shindo>.freeze, [">= 0"])
  end
end
