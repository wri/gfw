lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "rack_reverse_proxy/version"

Gem::Specification.new do |spec|
  spec.name          = "rack-reverse-proxy"
  spec.version       = RackReverseProxy::VERSION

  spec.authors = [
    "Jon Swope",
    "Ian Ehlert",
    "Roman Ernst",
    "Oleksii Fedorov"
  ]

  spec.email = [
    "jaswope@gmail.com",
    "ehlertij@gmail.com",
    "rernst@farbenmeer.net",
    "waterlink000@gmail.com"
  ]

  spec.summary       = "A Simple Reverse Proxy for Rack"
  spec.description   = <<eos
A Rack based reverse proxy for basic needs.
Useful for testing or in cases where webserver configuration is unavailable.
eos

  spec.homepage      = "https://github.com/waterlink/rack-reverse-proxy"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency "rack", ">= 1.0.0"
  spec.add_dependency "rack-proxy", "~> 0.5", ">= 0.5.14"

  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.3"
end
