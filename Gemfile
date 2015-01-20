source 'https://rubygems.org'
ruby '2.1.0'

gem 'rails', '4.2'
gem 'jquery-rails'
gem 'sass-rails', '~> 4.0.0'
gem 'compass-rails', '1.1.2'
gem 'compass-flexbox'
gem 'uglifier', '>= 1.3.0'
gem 'httparty'
gem 'typhoeus'
gem 'useragent'
gem 'carrierwave'
gem 'fog'
gem 'rmagick', :require => false
gem 'unf'
gem 'requirejs-rails'
gem 'rack-reverse-proxy', :path => "rack-reverse-proxy-0.4.4/", require: "rack/reverse_proxy"

group :development, :test do
  gem 'rspec-rails', '~> 2.0'
  gem 'launchy' # this lets us call save_and_open_page to see what's on a page for debugging capybara tests
  gem 'capybara', '2.0.3'  # capybara-webkit works with this version
  gem 'capybara-screenshot'
  gem 'show_me_the_cookies'
  gem 'factory_girl_rails'
  gem 'shoulda-matchers'
  gem 'database_cleaner'
  gem 'debugger'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'foreman'
  gem 'capistrano'
end

group :production do
  gem 'rails_12factor'
end

gem 'newrelic_rpm'
gem 'unicorn'
