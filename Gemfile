source 'https://rubygems.org'
ruby '2.3.1'

gem 'rails', '4.1.0'
gem 'jquery-rails'
gem 'autoprefixer-rails', '~> 6.3.6.2'
gem 'sass-rails', '~> 4.0.3'
gem 'compass-rails', '1.1.2'
gem 'compass-flexbox'
gem 'uglifier', '>= 1.3.0'
gem 'httparty'
gem 'typhoeus'
gem 'useragent'
gem 'carrierwave'
gem 'fog'
gem 'rmagick', :require => false
gem 'mini_magick'
gem 'unf'
gem 'requirejs-rails', '0.9.5'
gem 'rack-reverse-proxy', '~> 0.11.0', :require => 'rack/reverse_proxy'
# Amazon Ruby sdk for file upload to S3
gem 'aws-sdk', '~> 2'

group :development, :test do
  gem 'rspec-rails', '~> 2.0'
  gem 'show_me_the_cookies'
  gem 'factory_girl_rails'
  gem 'shoulda-matchers'
  gem 'database_cleaner'
  gem 'byebug'
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
gem 'puma'

gem 'dotenv-rails', :groups => [:development, :test]
