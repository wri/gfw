source "https://rubygems.org"

gemspec

ruby_version = RUBY_VERSION.to_f
rubocop_platform = [:ruby_20, :ruby_21, :ruby_22]
rubocop_platform = [:ruby_20, :ruby_21] if ruby_version < 2.0

group :test do
  gem "rspec"
  gem "rack-test"
  gem "webmock"
  gem "rubocop", :platform => rubocop_platform

  gem "addressable", "< 2.4" if ruby_version < 1.9
end

group :development, :test do
  gem "simplecov"
end
