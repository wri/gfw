Gem::Specification.new do |s|
  s.name = %q{rack-reverse-proxy}
  s.version = "0.4.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Jon Swope"]
  s.date = %q{2012-01-26}
  s.description = %q{A Rack based reverse proxy for basic needs.  Useful for testing or in cases where webserver configuration is unavailable.}
  s.email = %q{jaswope@gmail.com}
  s.extra_rdoc_files = [
    "LICENSE",
    "README.rdoc"
  ]
  s.files = [
    ".document",
    "LICENSE",
    "README.rdoc",
    "Rakefile",
    "VERSION",
    "lib/rack/reverse_proxy.rb",
    "rack-reverse-proxy.gemspec",
    "spec/rack/reverse_proxy_spec.rb",
    "spec/spec.opts",
    "spec/spec_helper.rb"
  ]
  s.homepage = %q{http://github.com/jaswope/rack-reverse-proxy}
  s.require_paths = ["lib"]
  s.rubygems_version = %q{1.3.7}
  s.summary = %q{A Simple Reverse Proxy for Rack}
  s.test_files = [
    "spec/rack/reverse_proxy_spec.rb",
    "spec/spec_helper.rb"
  ]

  s.add_development_dependency "rspec", "~> 1.3.2"
  s.add_development_dependency "bundler", "~> 1.0.15"
  s.add_development_dependency "rake", "~> 0.8.7"
  s.add_development_dependency "rack-test", "~> 0.5.7"
  s.add_development_dependency "webmock", "~> 1.5.0"
  s.add_dependency "rack", ">= 1.0.0"
end

