source 'https://rubygems.org'

ruby '2.4.0'

gem 'rails', '5.2.2.1'
gem 'sprockets-rails', '2.3.3'
gem 'uglifier', '~> 4.1.19'
gem 'httparty'
gem 'typhoeus'
gem 'useragent'
gem 'fog'
gem 'ffi',  '~> 1.9.24'
gem 'unf'
gem 'sitemap_generator'
gem 'redis'
gem 'redis-namespace'
gem 'redis-rails'

gem 'rack-reverse-proxy', '~> 0.12.0', :require => 'rack/reverse_proxy'

#Webpacker
gem 'webpacker', '~> 3.5.5'

# http://edgeguides.rubyonrails.org/upgrading_ruby_on_rails.html#responders
gem 'responders', '~> 2.0'

gem 'nokogiri', '~> 1.10.5'

group :development, :test do
  gem 'rspec-rails', '~> 3.8.1'
  gem 'show_me_the_cookies'
  gem 'factory_bot_rails'
  gem 'shoulda-matchers'
  gem 'byebug'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'foreman'
  gem 'capistrano'
  gem 'spring'
  gem 'web-console', '~> 3.7'
end

group :production do
  gem 'rails_12factor'
end

group :test do
  gem 'rails-controller-testing'
  gem 'simplecov'
  gem 'vcr'
end

gem 'newrelic_rpm'
gem 'puma'

gem 'dotenv-rails', :groups => [:development, :test, :production_local]
